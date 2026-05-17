# Lists all available commands
default:
    @just --list

# Builds the extension
build:
    bun run build

# Runs checks on the extension
check:
    bun run check

# Removes generated files and directories (node_modules, build artifacts, etc.)
clean:
    bun run clean

# Runs the extension in development mode
dev:
    bun run dev

# Runs all prek hooks to format and lint code
format:
    prek run --config tools/prek.toml --all-files

# Install project dependencies
install:
    bun install
