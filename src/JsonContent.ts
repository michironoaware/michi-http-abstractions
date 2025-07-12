import { StringContent } from "./StringContent.js";

/**
 * Provides HTTP content based on JSON.
 * @sealed
 * */
export class JsonContent extends StringContent {
	/**
	 * Initializes a new instance of {@link JsonContent}
	 * @param value The value to serialize and provide as JSON.
	 * @param replacer A function that transforms the results.
	 * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
	 * */
	public constructor(value: unknown, replacer?: (this: any, key: string, value: any) => any, space?: string | number);

	/**
	 * Initializes a new instance of {@link JsonContent}
	 * @param value The value to serialize and provide as JSON.
	 * @param replacer A function that transforms the results.
	 * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
	 * */
	public constructor(value: unknown, replacer?: (number | string)[] | null, space?: string | number);

	public constructor(
		value: unknown,
		replacer?: ((this: any, key: string, value: any) => any) | ((number | string)[] | null),
		space?: string | number,
	) {
		super(JSON.stringify(value, replacer as any), "application/json");
	}
}
