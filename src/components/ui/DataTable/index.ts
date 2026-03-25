/** DataTable: Define and Confing ALL Columns
 * TAG-CASE#1: Enterprise DataTable Component Package
 * High-Standard Barrel Export for Modular Architecture
 */

// 1. Export the main component
export { DataTable } from './DataTable';

// 2. Export sub-components if they are needed elsewhere (Optional)
export { GlobalSearch } from './GlobalSearch';
export { PaginationControls } from './Pagination';

// 3. Export Types for strict TypeScript implementation in pages
export type { ColumnDef } from '@tanstack/react-table';