/** DataTableV3: Auto Create Header and Auto Load Data(Direct Pass JSON) - Resizable Coloumn Width

 * TAG-CASE#2: Enterprise DataTable Component Package
 * High-Standard Barrel Export for Modular Architecture
 */

// 1. Export the main component
export { DataTableV3 } from './DataTable';

// 2. Export sub-components if they are needed elsewhere (Optional)
export { GlobalSearch } from './GlobalSearch';
export { PaginationControls } from './Pagination';

// 3. Export Types for strict TypeScript implementation in pages
export type { ColumnDef } from '@tanstack/react-table';