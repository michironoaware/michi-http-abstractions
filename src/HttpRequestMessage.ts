import { HttpMethod } from "./HttpMethod";
import { HttpContent } from "./HttpContent";
import { HeaderMap } from "./HeaderMap";
import { IAsyncDisposable } from "./IAsyncDisposable";
import { TypeHelper } from "michi-typehelper";
import { MichiHttpObjectDisposedError } from "./MichiHttpObjectDisposedError";

/**
 * Represents an HTTP request message.
 * @remarks The {@link HttpRequestMessage} class contains headers, the HTTP verb, and potentially data.
 *          An {@link HttpRequestMessage} instance should not be modified and/or reused after being sent.
 * @sealed
 * */
export class HttpRequestMessage implements IAsyncDisposable {
	readonly #_headers: HeaderMap;
	#_method: HttpMethod;
	#_requestUri: URL | string;
	#_content: HttpContent | null;
	#_disposed: boolean = false;

	/**
	 * Initializes a new instance of the HttpRequestMessage class with an HTTP method and a request Uri.
	 * @param method The HTTP method.
	 * @param requestUri The Uri to request.
	 * */
	public constructor(method: HttpMethod, requestUri: URL | string) {
		TypeHelper.throwIfNotType(method, HttpMethod);
		TypeHelper.throwIfNotAnyType(requestUri, URL, "string");

		this.#_method = method;
		this.#_requestUri = requestUri;
		this.#_headers = new HeaderMap();
		this.#_content = null;
	}

	/**
	 * Gets the HTTP method used by the HTTP request message.
	 * */
	public get method() {
		return this.#_method;
	}

	/**
	 * Sets the HTTP method used by the HTTP request message.
	 * */
	public set method(value: HttpMethod) {
		TypeHelper.throwIfNotType(value, HttpMethod);

		this.#_method = value;
	}

	/**
	 * Gets the Uri used for the HTTP request.
	 * */
	public get requestUri() {
		return this.#_requestUri;
	}

	/**
	 * Sets the Uri used for the HTTP request.
	 * */
	public set requestUri(value: URL | string) {
		TypeHelper.throwIfNotAnyType(value, URL, "string");

		this.#_requestUri = value;
	}

	/**
	 * Gets the collection of HTTP request headers.
	 * */
	public get headers() {
		return this.#_headers;
	}

	/**
	 * Gets the contents of the HTTP message.
	 * */
	public get content() {
		MichiHttpObjectDisposedError.throwIf(this.#_disposed);
		return this.#_content;
	}

	/**
	 * Sets the contents of the HTTP message.
	 * */
	public set content(value: HttpContent | null) {
		MichiHttpObjectDisposedError.throwIf(this.#_disposed);
		TypeHelper.throwIfNotAnyType(value, HttpContent, "null");

		this.#_content = value;
	}

	public async [Symbol.asyncDispose]() {
		if (this.#_disposed) {
			return;
		}

		await this.content?.[Symbol.asyncDispose]();
		this.#_disposed = true;
	}
}
