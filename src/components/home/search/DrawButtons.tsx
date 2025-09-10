import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Funnel, Columns2, Download, File, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Data, PropsType, ColumnKey } from "../../../pages/home/types";
import { columnGroups } from "../../../pages/home/columnGroups";

export function DrawButtons(props: PropsType) {
  const exportName = "relatório";

  function downloadPdf(rows: Data[]) {
    const visibleKey = Object.keys(props.colums).filter(
      (key) => props.colums[key as keyof typeof props.colums].isVisible
    );
    const format: string =
      visibleKey.length <= 25
        ? "a4"
        : visibleKey.length <= 50
        ? "a3"
        : visibleKey.length <= 75
        ? "a2"
        : "a1";

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format });
    const headers = visibleKey.map((key) => props.colums[key as keyof typeof props.colums].label);
    const data = rows.map((row) =>
      visibleKey.map((key) => {
        const typedKey = key as keyof Data;
        const value = row[typedKey];

        if (key === "compensation") {
          const num: number = Number(value);
          return isNaN(num)
            ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(0)
            : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num);
        }

        if (value !== null && value !== undefined) {
          let str = String(value).trim();
          if (typeof value === "boolean") str = value ? "Sim" : "Não";
          return str === "" ? "-" : str;
        }
        return "-";
      })
    );

    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 10,
      margin: { left: 5, right: 5 },
      styles: { fontSize: 5, cellPadding: 0.5, overflow: "linebreak", halign: "center" },
      headStyles: { fontSize: 6, fontStyle: "bold", fillColor: [200, 200, 200], halign: "center" },
      tableWidth: "auto",
      theme: "grid",
      showHead: "everyPage",
      pageBreak: "auto",
      rowPageBreak: "avoid",
    });

    doc.save(exportName + ".pdf");
  }

  function downloadCsv(rows: Data[]) {
    const visibleKey = Object.keys(props.colums).filter(
      (key) => props.colums[key as keyof typeof props.colums].isVisible
    );

    const header = visibleKey
      .map((key) => props.colums[key as keyof typeof props.colums].label || key)
      .join(",");

    const body = rows
      .map((row) =>
        visibleKey
          .map((key) => {
            const typedKey = key as keyof Data;
            const value = row[typedKey];
            const str: string = String(value ?? "").trim();

            if (key === "compensation") return Number(value).toFixed(2);
            if (!str) return `""`;
            if (str.includes(",") || str.includes("'") || str.includes('"')) return `"${str}"`;

            return str;
          })
          .join(",")
      )
      .join("\n");

    const csvContent = `${header}\n${body}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", exportName + ".csv");
    link.click();
  }

  return (
    <div className="flex w-full justify-between gap-2">
      <div className="flex gap-3">
        {/* ---------------- Filtros ---------------- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="cursor-pointer text-base">
              <Funnel className="mr-2 h-4 w-4" /> Filtros
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" side="bottom" align="start">
            <DropdownMenuLabel>Filtros Disponíveis</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.entries(props.colums).map(([key, col]) => (
              <DropdownMenuItem
                key={key}
                className={`cursor-pointer ${key === props.activeFilter ? "bg-gray-300" : ""} hover:bg-gray-200 focus:bg-gray-200`}
                onClick={() => props.setActiveFilter(key as ColumnKey)}
              >
                {col.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* ---------------- Colunas ---------------- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="cursor-pointer text-base">
              <Columns2 className="mr-2 h-4 w-4" /> Colunas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" side="bottom" align="start">
            <DropdownMenuLabel>Exibir/Ocultar Colunas</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.entries(columnGroups).map(([group, items]) => (
              <DropdownMenuSub key={group}>
                <DropdownMenuSubTrigger className="hover:bg-gray-200 focus:bg-gray-200">{group}</DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-64">
                  {items.map((item) => {
                    if (typeof item === "string") {
                      const col = props.colums[item];
                      if (!col) return null;
                      return (
                        <DropdownMenuCheckboxItem
                          key={item}
                          checked={col.isVisible}
                          className="hover:bg-gray-200 focus:bg-gray-200"
                          onCheckedChange={(checked) =>
                            props.setColums((prev) => ({
                              ...prev,
                              [item]: { ...prev[item], isVisible: !!checked },
                            }))
                          }
                        >
                          {col.label}
                        </DropdownMenuCheckboxItem>
                      );
                    } else {
                      return Object.entries(item).map(([subLabel, subKeys]) => (
                        <DropdownMenuSub key={subLabel}>
                          <DropdownMenuSubTrigger >{subLabel}</DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="w-64">
                            {subKeys.map((subKey) => {
                              const col = props.colums[subKey];
                              if (!col) return null;
                              return (
                                <DropdownMenuCheckboxItem
                                  key={subKey}
                                  checked={col.isVisible}
                                  className="hover:bg-gray-200 focus:bg-gray-200"
                                  onCheckedChange={(checked) =>
                                    props.setColums((prev) => ({
                                      ...prev,
                                      [subKey]: { ...prev[subKey], isVisible: !!checked },
                                    }))
                                  }
                                >
                                  {col.label}
                                </DropdownMenuCheckboxItem>
                              );
                            })}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      ));
                    }
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ---------------- Exportar ---------------- */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="cursor-pointer text-base">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" side="bottom" align="start">
          <DropdownMenuLabel>Exportar Dados</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => downloadPdf(props.filteredRows)}
            className="hover:bg-gray-200 focus:bg-gray-200"
          >
            <FileText className="mr-2 h-4 w-4" /> Exportar como PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => downloadCsv(props.filteredRows)}
            className="hover:bg-gray-200 focus:bg-gray-200"
          >
            <File className="mr-2 h-4 w-4" /> Exportar como CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
