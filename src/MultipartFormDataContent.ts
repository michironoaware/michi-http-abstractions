import { MultipartContent } from "./MultipartContent";
import { HttpContent } from "./HttpContent";
import { TypeHelper } from "michi-typehelper";
import { MichiHttpObjectDisposedError } from "./MichiHttpObjectDisposedError";

/**
 * Provides a container for content encoded using multipart/form-data MIME type.
 * @sealed
 * @remarks This type is derived from {@link MultipartContent} type.
 *          All {@link MultipartFormDataContent} does is provide methods to add
 *          required Content-Disposition headers to content object added to the collection.
 * */
export class MultipartFormDataContent extends MultipartContent {
	/**
	 * Initializes a new instance of {@link MultipartFormDataContent}.
	 * */
	public constructor(boundary?: string) {
		super("form-data", boundary);
	}

	/**
	 * Add HTTP content to a collection of {@link HttpContent} objects that get serialized to multipart/form-data MIME type.
	 * @param content The HTTP content to add to the collection.
	 * @param name The name for the HTTP content to add.
	 * @param filename The file name for the HTTP content to add to the collection.
	 * @throws {MichiHttpObjectDisposedError} If the instance has been disposed.
	 * */
	public add(content: HttpContent, name?: string, filename?: string) {
		TypeHelper.throwIfNotType(content, HttpContent);
		TypeHelper.throwIfNotAnyType(name, "string", "undefined");
		TypeHelper.throwIfNotAnyType(filename, "string", "undefined");

		content.headers.add("content-disposition", "form-data");

		if (name !== undefined) {
			content.headers.append("content-disposition", `name="${name}"`);
		}

		if (filename !== undefined) {
			content.headers.append("content-disposition", `filename="${filename}"`);
		}

		super.add(content);
	}
}
