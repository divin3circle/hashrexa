## Contributing Guidelines

### How to contribute
1. Open an issue describing the change or bug.
2. Create a feature branch from `main`: `git checkout -b feat/<short-topic>`.
3. Commit with Conventional Commits (e.g., `feat(ai): add lending SSE endpoint`).
4. Open a Pull Request (PR) with a clear description, screenshots/logs when relevant.

### Coding standards
- Java (ai/): Java 21, Spring Boot. Prefer meaningful names, early returns, clear error handling. Avoid committing secrets.
- Go (backend/): Go 1.22. Keep handlers focused, validate inputs, return structured JSON. Prefer small functions with clear names.
- TypeScript (frontend/): Strong typing, small cohesive hooks and components.

### Branch naming
- Features: `feat/<topic>`
- Fixes: `fix/<topic>`
- Chores/Docs: `chore/<topic>`, `docs/<topic>`

### PR guidelines
- Link related issue(s)
- Describe changes and rationale
- Add test steps or curl examples
- Ensure build passes locally (Java service runs, Go backend runs)


