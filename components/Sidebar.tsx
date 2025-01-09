import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ComboboxDemo } from "./Combobox";
import { Textarea } from "./ui/textarea";

const Sidebar = () => {
  return (
    <div className="w-[400px] border border-red-500">
      <div>
        Tạo ma trận
        <div>
          <Button>Random</Button>
          <Button>Chọn File</Button>
        </div>
        <div>
          <Textarea className="h-[300px]"/>
        </div>
        <div>
          <Button>Tạo</Button>
        </div>
      </div>

      <div>
        <div>Chọn chủ đề</div>
        <ComboboxDemo />
      </div>
    </div>
  );
};

export default Sidebar;
