# Contributing to the Enterprise Billing & Registry System

This document outlines the coding standards and architectural principles required for contributing to this project. As this is a **Senior Architect-level implementation**, all contributions must adhere to high standards of modularity, type safety, and performance.

---

## 🛠 Coding Standards

### 1. Frontend (React / Next.js)
* **Type Safety:** Strict TypeScript is mandatory. Avoid using `any`. Define interfaces for all API responses and component props.
* **Component Architecture:** Follow a "Modular Component" pattern. Large components should be broken down into smaller, reusable atoms and molecules.
* **State Management:** Use React Context or specialized hooks for local state. Ensure all side effects in `useEffect` are properly cleaned up.
* **Styling:** Use Tailwind CSS for utility-first styling. For complex animations or unique layouts, use SCSS modules to maintain scoping.

### 2. Backend (Java Spring Boot)
* **Package Structure:** Maintain the established hierarchy under `com.sun.absbs.billing`.
* **Service Layer:** Business logic must reside strictly in `@Service` classes. Controllers should only handle request mapping and DTO transformation.
* **Persistence:** Use JPA/Hibernate best practices. Ensure `@OneToMany` or `@ManyToMany` relationships use lazy loading where appropriate to prevent N+1 issues.
* **Caching:** When implementing new endpoints, consider the EhCache/Redis fallback logic to ensure high-speed data retrieval.

---

## 🏷 Commit & Tagging Protocol (TAG-CASE)

To maintain a clear version history, all major feature implementations must be tagged using the `TAG-CASE` convention:

| Tag | Focus Area | Requirement |
| :--- | :--- | :--- |
| **TAG-CASE#1** | **DataTable Core** | Used for any modifications to the core table engine, sorting, or pagination logic. |
| **TAG-CASE#2** | **Hierarchical Logic** | Used for recursive data structures, parenting logic, and Family Tree navigation. |
| **TAG-CASE#3** | **Billing Orchestration** | Used for backend financial services, invoice generation, and persistence logic. |
| **TAG-CASE#4** | **AI Integration** | Used for ArchitectOS dashboard features and AI-powered task insights. |
| **TAG-CASE#5** | **Master Registry UI** | Used for final layout alignments, UI verification, and frontend-to-backend binding. |

**Example Commit Message:**
`git commit -m "[TAG-CASE#1] Implement server-side sorting for the registry table"`

---

## 🧪 Pull Request Process

1.  **Branch Naming:** Use descriptive names like `feature/billing-api` or `fix/table-scroll`.
2.  **Linting:** Run `npm run lint` (Frontend) or checkstyle (Backend) before submitting.
3.  **Documentation:** Update the main `README.md` if your change introduces a new dependency or environment variable.
4.  **Naming Convention:** Remember that all new project or package names must be **lowercase** to avoid deployment errors.

---

## 📐 Quality Gate
All code will be reviewed with a focus on:
* **Dry Principle:** Don't Repeat Yourself.
* **Solid Principles:** Ensure classes have a single responsibility.
* **Performance:** Minimize database hits and re-renders.

---

*Thank you for maintaining the architectural integrity of the system.*