import { TypeHelper } from "michi-typehelper";
import { MichiHttpInvalidOperationError } from "./MichiHttpInvalidOperationError";

export class UInt8Stream extends WritableStream<Uint8Array> {
	#_buffer: ArrayBuffer;
	#_bufferView: Uint8Array;
	#_nextPosition: number = 0;
	#_closed: boolean = false;

	constructor(initialLength: number) {
		const write = (bytes: Uint8Array) => {
			if (this.#_buffer.byteLength - this.#_nextPosition < bytes.length) {
				this.#_buffer = this.#_buffer.transfer(
					Math.max(this.#_buffer.byteLength + bytes.length, this.#_buffer.byteLength * 2),
				);
				this.#_bufferView = new Uint8Array(this.#_buffer);
			}

			this.#_bufferView.set(bytes, this.#_nextPosition);
			this.#_nextPosition += bytes.length;
		};

		const close = () => {
			this.#_bufferView = new Uint8Array(this.#_buffer, 0, this.#_nextPosition);
			this.#_closed = true;
		};

		super({ write, close });
		TypeHelper.throwIfNotType(initialLength, "number");
		if (initialLength < 1) throw new RangeError("value is less than other");

		this.#_buffer = new ArrayBuffer(initialLength);
		this.#_bufferView = new Uint8Array(this.#_buffer);
	}

	public get written() {
		if (!this.#_closed) {
			throw new MichiHttpInvalidOperationError("Cannot read a stream that is not closed.");
		}

		return this.#_bufferView;
	}
}
