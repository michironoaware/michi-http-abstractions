import { TypeHelper } from "michi-typehelper";

/**
 * The exception that is thrown when a method call is invalid for the object's current state.
 * */
export class MichiHttpInvalidOperationError extends Error {
	/**
	 * Initializes a new instance of {@link MichiHttpInvalidOperationError}.
	 * @param message The error message.
	 * @package
	 * */
	public constructor(message: string) {
		super(message);
		TypeHelper.throwIfNotType(message, "string");
	}

	/**
	 * Throws an {@link MichiHttpInvalidOperationError} if the specified condition is true.
	 * @param condition The condition to evaluate.
	 * @param message The message of the error.
	 * @package
	 * */
	public static throwIf(condition: boolean, message: string): asserts condition is false {
		TypeHelper.throwIfNotType(condition, "boolean");
		TypeHelper.throwIfNotType(message, "string");

		if (condition) {
			throw new MichiHttpInvalidOperationError(message);
		}
	}
}
