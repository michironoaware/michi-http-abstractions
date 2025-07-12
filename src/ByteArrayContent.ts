﻿import { HeaderMap } from "./HeaderMap";
import { HttpContent } from "./HttpContent";
import { TypeHelper } from "michi-typehelper";

/**
 * Provides HTTP content based on a byte array.
 * */
export class ByteArrayContent extends HttpContent {
	readonly #_headers: HeaderMap = new HeaderMap();
	readonly #_byteArray: Uint8Array;

	/**
	 * Initializes a new instance of {@link ByteArrayContent}
	 * @param bytes The byte array with the content.
	 * @param contentType The media type of the content as defined in {@link https://www.rfc-editor.org/rfc/rfc6838 RFC 6836}.
	 * */
	public constructor(bytes: Uint8Array, contentType: string = "application/octet-stream") {
		super();
		TypeHelper.throwIfNotType(bytes, Uint8Array);
		TypeHelper.throwIfNotType(contentType, "string");

		this.#_byteArray = bytes;
		this.#_headers.append("Content-Type", contentType);
	}

	public get headers() {
		return this.#_headers;
	}

	public readAsStream() {
		const byteArray = this.#_byteArray;

		const stream = new ReadableStream<Uint8Array>({
			start(controller) {
				controller.enqueue(byteArray);
				controller.close();
			},
		});

		return Promise.resolve(stream);
	}

	public [Symbol.asyncDispose]() {
		return Promise.resolve();
	}
}
