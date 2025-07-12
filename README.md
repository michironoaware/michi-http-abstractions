# michi-http-abstractions

A framework-agnostic JavaScript library with HTTP utilities and .NET-inspired abstractions.

##  Key Features
- Small, composable units for building reusable HTTP logic.
- Framework-agnostic: works in Node.js, Deno, browsers, and edge runtimes.
- TypeScript support with well-defined types.

## Why michi-http-abstractions?

`michi-http-abstractions` offers a structured and extensible approach to working with HTTP
in JavaScript and TypeScript, inspired by the .NET `HttpClient` architecture.
It introduces abstractions like `HttpClient`, `HttpRequestMessage`, `HttpContent`,
and `HttpHandler` to enable clean separation of concerns and reusable HTTP logic.

You can build flexible pipelines by composing HttpHandlers,
making it easy to add cross-cutting behaviors like logging, retries,
or authentication in a clean and modular way.

The library also supports custom HttpContent implementations, giving
you full control over how request data is serialized, structured, and transmitted.

Built to be framework-agnostic, it runs consistently across Node.js, Deno, browsers,
and edge runtimes, providing a unified and type-safe experience across environments.

## Installation
```shell
npm i michi-http-abstractions
```
## Compatibility
`michi-http-abstractions` is compatible with any framework or runtime that supports `ES2024`.

## Usage Examples

### Fetch blogs from an API
```ts
import {
	HttpClient,
	HttpFetchHandler,
	HttpRequestMessage,
	HttpMethod } from "michi-http-abstractions";

await using client = new HttpClient(new HttpFetchHandler(), true);

const request = new HttpRequestMessage(HttpMethod.Get, "https://api.example.com/blogs");
const response = await client.send(request);
response.ensureSuccessStatusCode();

const blogs = JSON.parse(await response.content.readAsString());
for (const blog of blogs) {
	console.log(blog.title);
	console.log(blog.body);
}
```

### Upload a file to an API
```ts
import {
	HttpClient,
	HttpFetchHandler,
	HttpRequestMessage,
	HttpMethod,
	MultipartFormDataContent,
	ByteArrayContent } from "michi-http-abstractions";

const audioFile = new Uint8Array();

await using client = new HttpClient(new HttpFetchHandler(), true);
client.baseAddress = new URL("https://api.example.com/");
client.defaultRequestHeaders.add("Authorization", "Bearer ABC_XYZ");

const request = new HttpRequestMessage(HttpMethod.Post, "files");
const multipart = new MultipartFormDataContent();
multipart.add(new ByteArrayContent(audioFile, "audio/ogg"), "file");
request.content = multipart;

const response = await client.send(request);
response.ensureSuccessStatusCode();
```

### Chain multiple HttpHandlers to create more complex pipelines
```ts
import {
	HttpRequestMessage,
	DelegatingHandler,
	HttpClient,
	HttpFetchHandler,
	HttpMethod } from "michi-http-abstractions";

class LogHandler extends DelegatingHandler {
	public async send(message: HttpRequestMessage, abortSignal: AbortSignal) {
		abortSignal.throwIfAborted();
		console.log(`${message.method.name} ${message.requestUri.toString()}`);
		return await super.send(message, abortSignal);
	}
}

const handler = new LogHandler(new HttpFetchHandler(), true);
await using client = new HttpClient(handler, true);

const request = new HttpRequestMessage(HttpMethod.Get, "https://api.example.com/blogs");
await client.send(request); // Will log "GET https://api.example.com/blogs"
                            // and then send the request.
```

> \[!NOTE]
> This library is primarily developed for personal use.
> However, it is well documented and maintained, and I am open to evolving it into a
> more polished and broadly suitable solution for public use. 
> If you have suggestions, feedback, or would like to contribute to making it more robust,
> feel free to reach out or open an issue.