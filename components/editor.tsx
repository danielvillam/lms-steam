"use client";

interface CustomElement extends BaseElement {
    type: string;
    children: Descendant[];
}

type CustomDescendant = CustomElement | Descendant;
import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Descendant, BaseElement } from 'slate';
import { Slate, Editable, withReact } from "slate-react";

interface EditorProps {
    onChange: (value: string) => void;
    value: string;
}

export const Editor = ({ onChange, value }: EditorProps) => {
    const editor = useMemo(() => withReact(createEditor()), []);
    const [editorValue, setEditorValue] = useState<CustomDescendant[]>([
        {
            type: "paragraph",
            children: [{ text: value || "Escribe algo aquí..." }],
        },
    ]);

    const handleChange = useCallback(
        (newValue: any) => {
            setEditorValue(newValue);
            const plainText = newValue.map((node: any) => node.children[0].text).join("\n");
            onChange(plainText);
        },
        [onChange]
    );

    return (
        <div className="bg-white p-4 border rounded">
            <Slate editor={editor} initialValue={editorValue} onChange={handleChange}>
                <Editable placeholder="Escribe algo aquí..." />
            </Slate>
        </div>
    );
};
