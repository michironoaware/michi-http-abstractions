import { TypeHelper } from "michi-typehelper";
import { MichiHttpInvalidOperationError } from "./MichiHttpInvalidOperationError";

/**
 * The exception that is thrown when an operation is performed on a disposed object.
 * @sealed
 * */
export class MichiHttpObjectDisposedError extends MichiHttpInvalidOperationError {
	/**
	 * Initializes a new instance of {@link MichiHttpObjectDisposedError}.
	 * @package
	 * */
	public constructor() {
		super("Cannot access a disposed object");
	}

	/**
	 * Throws an {@link MichiHttpObjectDisposedError} if the specified condition is true.
	 * @param condition The condition to evaluate.
	 * @package
	 * */
	public static throwIf(condition: boolean): asserts condition is false {
		TypeHelper.throwIfNotType(condition, "boolean");

		if (condition) {
			throw new MichiHttpObjectDisposedError();
		}
	}
}
