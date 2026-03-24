/* Enterprise DataTable - Modular Styles 
   Theme: Cool & Calm (Slate & Indigo)
*/

.enterprise-table-wrapper {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0; // slate-200
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  font-family: inherit;
  margin-top: 1rem;

  .table-controls-bar {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background: #ffffff;
    border-bottom: 1px solid #f1f5f9; // slate-100
    gap: 1rem;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .table-container {
    width: 100%;
    overflow-x: auto;
    
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;

      thead {
        background-color: #f8fafc; // slate-50
        
        th {
          padding: 0.85rem 1.5rem;
          text-align: left;
          font-size: 0.7rem;
          font-weight: 700;
          color: #64748b; // slate-500
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #e2e8f0;
          white-space: nowrap;
          transition: all 0.2s ease;

          &:hover {
            color: #1e293b;
            background-color: #f1f5f9;
          }
        }
      }

      tbody {
        tr {
          transition: background-color 0.2s ease;
          
          td {
            padding: 1rem 1.5rem;
            font-size: 0.875rem;
            color: #334155; // slate-700
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
          }

          &:hover {
            background-color: rgba(239, 246, 255, 0.5); // soft blue-50 hover
          }

          /* Global Selection Style (Fix #1 Integration) */
          &.row-selected {
            background-color: #eff6ff; // blue-50
            
            td {
              color: #1e40af; // blue-800
              font-weight: 500;
            }
          }
        }
      }
    }
  }

  /* Custom Thin Scrollbar */
  .table-container::-webkit-scrollbar {
    height: 6px;
  }
  .table-container::-webkit-scrollbar-track {
    background: #f8fafc;
  }
  .table-container::-webkit-scrollbar-thumb {
    background: #cbd5e1; // slate-300
    border-radius: 10px;
    &:hover { background: #94a3b8; }
  }
}