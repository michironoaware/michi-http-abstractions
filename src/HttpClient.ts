import { HttpRequestMessage } from "./HttpRequestMessage";
import { HeaderMap } from "./HeaderMap";
import { HttpMessageHandler } from "./HttpMessageHandler";
import { IAsyncDisposable } from "./IAsyncDisposable";
import { TypeHelper } from "michi-typehelper";
import { MichiHttpInvalidOperationError } from "./MichiHttpInvalidOperationError";
import { MichiHttpObjectDisposedError } from "./MichiHttpObjectDisposedError";
import { NonAbortableSignal } from "./NonAbortableSignal";

/**
 * Provides a class for sending HTTP requests and receiving HTTP responses from a resource identified by a URI.
 * @sealed
 * */
export class HttpClient implements IAsyncDisposable {
	readonly #_handler: HttpMessageHandler;
	readonly #_disposeHandler: boolean;
	#_baseAddress: URL | null = null;
	#_defaultRequestHeaders: HeaderMap = new HeaderMap();
	#_disposed: boolean = false;

	/**
	 * Initializes a new instance that will use the provided {@link handler}.
	 * @param handler The {@link HttpMessageHandler} responsible for processing the HTTP messages.
	 * @param disposeHandler true if the inner handler should be disposed of by {@link HttpClient.dispose};
	 *                       false if you intend to reuse the inner handler.
	 * */
	public constructor(handler: HttpMessageHandler, disposeHandler: boolean = false) {
		TypeHelper.throwIfNotType(handler, HttpMessageHandler);
		TypeHelper.throwIfNotType(disposeHandler, "boolean");

		this.#_handler = handler;
		this.#_disposeHandler = disposeHandler;
	}

	/**
	 * Gets the base address of Uniform Resource Identifier (URI) of the Internet resource used when sending requests.
	 * */
	public get baseAddress() {
		return this.#_baseAddress;
	}

	/**
	 * Sets the base address of Uniform Resource Identifier (URI) of the Internet resource used when sending requests.
	 * */
	public set baseAddress(value: URL | null) {
		TypeHelper.throwIfNotAnyType(value, URL, "null");
		this.#_baseAddress = value;
	}

	/**
	 * Gets the headers which should be sent with each request.
	 * */
	public get defaultRequestHeaders() {
		return this.#_defaultRequestHeaders;
	}

	/**
	 * Send an HTTP request as an asynchronous operation.
	 * @param message The HTTP request message to send.
	 * @param abortSignal An optional signal to cancel the request.
	 * @throws MichiHttpInvalidOperationError If the {@link HttpClient} instance has no base address set
	 *                                        and the {@link HttpRequestMessage} request uri is relative.
	 * */
	public async send(message: HttpRequestMessage, abortSignal: AbortSignal = NonAbortableSignal) {
		TypeHelper.throwIfNotType(message, HttpRequestMessage);
		TypeHelper.throwIfNotType(abortSignal, AbortSignal);
		MichiHttpObjectDisposedError.throwIf(this.#_disposed);

		if (!(message.requestUri instanceof URL)) {
			let requestUri: URL;
			try {
				// Throws a TypeError if the uri is not absolute.
				requestUri = new URL(message.requestUri);
			} catch (error) {
				if (!(error instanceof TypeError)) {
					// Rethrow unwanted error type.
					throw error;
				}

				if (this.#_baseAddress === null) {
					throw new MichiHttpInvalidOperationError(
						"The HttpClient has no base address set, the request uri cannot be relative",
					);
				}

				requestUri = new URL(message.requestUri, this.#_baseAddress.href);
			}

			message.requestUri = requestUri;
		}

		message.content?.headers.forEach((headerValues, headerName) => {
			if (message.headers.has(headerName)) {
				message.headers.delete(headerName);
			}

			for (const headerValue of headerValues) {
				message.headers.append(headerName, headerValue);
			}
		});

		this.#_defaultRequestHeaders.forEach((headerValues, headerName) => {
			if (!message.headers.has(headerName)) {
				for (const headerValue of headerValues) {
					message.headers.append(headerName, headerValue);
				}
			}
		});

		const response = await this.#_handler.send(message, abortSignal);

		await message[Symbol.asyncDispose]();
		return response;
	}

	public async [Symbol.asyncDispose]() {
		if (this.#_disposed) {
			return;
		}

		if (this.#_disposeHandler) {
			await this.#_handler[Symbol.asyncDispose]();
		}

		this.#_disposed = true;
	}
}
