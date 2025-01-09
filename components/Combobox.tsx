"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGraph } from "@/context/GraphContext";
import { kruskal } from "@/app/algorthms/kuskal";
import { prim } from "@/app/algorthms/prim";

const frameworks = [
  {
    value: "TSP",
    label: "TSP",
    subOptions: [
      { value: "nearest", label: "Nearest Neighbor" },
      { value: "genetic", label: "Genetic Algorithm" },
    ],
  },
  {
    value: "tree",
    label: "Cây khung tối thiểu",
    subOptions: [
      { value: "kruskal", label: "Kruskal" },
      { value: "prim", label: "Prim" },
    ],
  },
  {
    value: "minium",
    label: "Tìm đường đi ngắn nhất",
    subOptions: [
      { value: "dijkstra", label: "Dijkstra" },
      { value: "bellman-ford", label: "Bellman-Ford" },
    ],
    requiresSource: true,
  },
];

// Giả sử đây là danh sách các đỉnh trong đồ thị
const vertices = Array.from({ length: 10 }, (_, i) => ({
  value: `${i + 1}`,
  label: `Đỉnh ${i + 1}`,
}));

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [openSub, setOpenSub] = React.useState(false);
  const [openSource, setOpenSource] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [subValue, setSubValue] = React.useState("");
  const [sourceVertex, setSourceVertex] = React.useState("");

  // Lấy dữ liệu và functions từ context
  const { edges, vertexCount, setAlgorithmResult } = useGraph();

  const selectedFramework = frameworks.find(
    (framework) => framework.value === value
  );

  // Hàm thực hiện thuật toán
  const runAlgorithm = () => {
    if (!edges || edges.length === 0) {
      alert("Vui lòng nhập dữ liệu đồ thị trước!");
      return;
    }

    switch (subValue) {
      case "kruskal":
        const resultKruskal = kruskal(edges, vertexCount);
        console.log(resultKruskal.totalWeight);
        setAlgorithmResult(resultKruskal);
        break;

      case "prim":
        // Thêm code cho thuật toán Prim
        const resultPrim = prim(edges, vertexCount);
        console.log(resultPrim.totalWeight);
        setAlgorithmResult(resultPrim);
        break;

      case "dijkstra":
        if (!sourceVertex) {
          alert("Vui lòng chọn đỉnh nguồn!");
          return;
        }
        // Thêm code cho thuật toán Dijkstra
        break;

      default:
        alert("Vui lòng chọn thuật toán!");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? frameworks.find((framework) => framework.value === value)?.label
              : "Select algorithm type..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search algorithm..." />
            <CommandList>
              <CommandEmpty>No algorithm found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setSubValue("");
                      setSourceVertex("");
                      setOpen(false);
                    }}
                  >
                    {framework.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === framework.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedFramework && (
        <Popover open={openSub} onOpenChange={setOpenSub}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openSub}
              className="w-[200px] justify-between"
            >
              {subValue
                ? selectedFramework.subOptions.find(
                    (option) => option.value === subValue
                  )?.label
                : "Select specific algorithm..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search specific algorithm..." />
              <CommandList>
                <CommandEmpty>No algorithm found.</CommandEmpty>
                <CommandGroup>
                  {selectedFramework.subOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        setSubValue(
                          currentValue === subValue ? "" : currentValue
                        );
                        setOpenSub(false);
                      }}
                    >
                      {option.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          subValue === option.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {/* Combobox cho đỉnh nguồn chỉ hiển thị khi chọn "Tìm đường đi ngắn nhất" */}
      {selectedFramework?.requiresSource && subValue && (
        <Popover open={openSource} onOpenChange={setOpenSource}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openSource}
              className="w-[200px] justify-between"
            >
              {sourceVertex
                ? `Đỉnh nguồn: ${sourceVertex}`
                : "Chọn đỉnh nguồn..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Tìm đỉnh..." />
              <CommandList>
                <CommandEmpty>Không tìm thấy đỉnh.</CommandEmpty>
                <CommandGroup>
                  {vertices.map((vertex) => (
                    <CommandItem
                      key={vertex.value}
                      value={vertex.value}
                      onSelect={(currentValue) => {
                        setSourceVertex(
                          currentValue === sourceVertex ? "" : currentValue
                        );
                        setOpenSource(false);
                      }}
                    >
                      {vertex.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          sourceVertex === vertex.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      <Button
        onClick={runAlgorithm}
        disabled={
          !value ||
          !subValue ||
          (selectedFramework?.requiresSource && !sourceVertex)
        }
      >
        Thực hiện thuật toán
      </Button>
    </div>
  );
}
