# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.2.0](https://github.com/32bitkid/4bitlabs.spatial/compare/@4bitlabs/vector@0.1.2...@4bitlabs/vector@0.2.0) (2024-07-24)

### Breaking

- consolidating get/set and mustGet/mustSet ([bb5f39c](https://github.com/32bitkid/4bitlabs.spatial/commit/bb5f39c6e4f9ffddc2d292cb088166505b2f3d66))

### Chore

- adding tests/coverage for Vector.clear() ([8ce55cc](https://github.com/32bitkid/4bitlabs.spatial/commit/8ce55cc00f6c76d138ca7c8c6baf14e1e834e513))
- allow customizable growth function. defaults to `ceil(cur * 1.5)` ([448cce4](https://github.com/32bitkid/4bitlabs.spatial/commit/448cce48b6870355c8192cbece4afc5d05863109))
- Fixing github refs in package.json ([b188cf7](https://github.com/32bitkid/4bitlabs.spatial/commit/b188cf75bbf46d32a2bc00e6f8ab9f7bcb571c37))

### Docs

- initial pass at adding documentation for Vector with typedoc ([ec2f2fa](https://github.com/32bitkid/4bitlabs.spatial/commit/ec2f2fad66e66062fac96a13420b3b1c4e122c1a))
- more improvements to Vector docs ([592ab3c](https://github.com/32bitkid/4bitlabs.spatial/commit/592ab3c6905ffdf139cf68274eab8641fd6239f5))

### New

- Added BigVector for BigUint64Array and BigInt64Array support. ([c0a5b5f](https://github.com/32bitkid/4bitlabs.spatial/commit/c0a5b5ffa76c528fbd1e274730d065cab934e2b7))

### Update

- allow variadic Vector#push() ([30832a4](https://github.com/32bitkid/4bitlabs.spatial/commit/30832a4bbe7083699c8b22187d6dcc102e440914))
- Vector#pushN returns the new length of the vector. like Vector#push ([b7445a1](https://github.com/32bitkid/4bitlabs.spatial/commit/b7445a1ef06c83932b3074d633d94d178c58d01c))

## [0.1.2](https://github.com/32bitkid/4bitlabs.spatial/compare/@4bitlabs/vector@0.1.1...@4bitlabs/vector@0.1.2) (2024-07-15)

### Chore

- add homepage/bugs/repository to package.json ([6de2208](https://github.com/32bitkid/4bitlabs.spatial/commit/6de220826a9a4425835b6031c90d694cce322f2f))
- clean up some internals/types ([a4fa40d](https://github.com/32bitkid/4bitlabs.spatial/commit/a4fa40d4f88f7b7332ded36ba431a6a8ca93dd7f))

## [0.1.1](https://github.com/32bitkid/4bitlabs.spatial/compare/@4bitlabs/vector@0.1.0...@4bitlabs/vector@0.1.1) (2024-07-15)

### Added

- vector.clear() method ([fb7dd9e](https://github.com/32bitkid/4bitlabs.spatial/commit/fb7dd9e4200602428925d1fb615031ce9fddb92f))

### Fixed

- initialLength and initialCapacity are forced into integers ([896a003](https://github.com/32bitkid/4bitlabs.spatial/commit/896a00353a91f41668c58f7d9f27ae769e94ba7e))

# 0.1.0 (2024-07-14)

### Added

- Create @4bitlabs/vector package. ([597d48b](https://github.com/32bitkid/4bitlabs.spatial/commit/597d48bfe4e72364c666d5f8b0921052da549ba4))
