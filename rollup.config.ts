import * as Path from "node:path";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default [
	//	{
	//		input: "src/index.ts",
	//		output: {
	//			file: "dist/index.js",
	//			format: "es",
	//			name: "Library",
	//		},
	//		treeshake: false,
	//		strictDeprecations: true,
	//		plugins: [
	//			typescript({
	//				tsconfig: "tsconfig.json",
	//				compilerOptions: { outDir: Path.dirname("dist/ts-out") },
	//			}),
	//		],
	//	},
	{
		input: "src/index.ts",
		output: {
			file: "dist/index.min.js",
			format: "es",
			name: "Library",
		},
		treeshake: false,
		strictDeprecations: true,
		plugins: [
			typescript({
				tsconfig: "tsconfig.json",
				compilerOptions: { outDir: Path.dirname("dist/ts-out") },
			}),
			terser(),
		],
	},
];
