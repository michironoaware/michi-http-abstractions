import { HttpContent } from "./HttpContent";
import { HeaderMap } from "./HeaderMap";
import { TypeHelper } from "michi-typehelper";
import { MichiHttpObjectDisposedError } from "./MichiHttpObjectDisposedError";

/**
 * Provides HTTP content based on a stream.
 * @sealed
 * */
export class StreamContent extends HttpContent {
	readonly #_stream: ReadableStream<Uint8Array>;
	readonly #_headers: HeaderMap = new HeaderMap();
	#_disposed: boolean = false;

	/**
	 * Initializes a new instance of {@link StreamContent}.
	 * @param stream The underlying stream of content.
	 * @param contentType The media type of the content as defined in {@link https://www.rfc-editor.org/rfc/rfc6838 RFC 6836}.
	 * */
	public constructor(stream: ReadableStream<Uint8Array>, contentType = "application/octet-stream") {
		super();
		TypeHelper.throwIfNotType(stream, ReadableStream<Uint8Array>);
		TypeHelper.throwIfNotType(contentType, "string");

		this.#_stream = stream;
		this.#_headers.append("Content-Type", contentType);
	}

	public get headers() {
		return this.#_headers;
	}

	public readAsStream() {
		MichiHttpObjectDisposedError.throwIf(this.#_disposed);
		return Promise.resolve(this.#_stream);
	}

	public async [Symbol.asyncDispose]() {
		if (this.#_disposed) {
			return;
		}

		await this.#_stream.cancel();
		this.#_disposed = true;
	}
}
