'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
    chart: string;
}

let mermaidInitialized = false;

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!mermaidInitialized) {
            mermaid.initialize({
                startOnLoad: false,
                theme: 'dark',
                themeVariables: {
                    primaryColor: '#8b5cf6',
                    primaryTextColor: '#fff',
                    primaryBorderColor: '#6d28d9',
                    lineColor: '#a78bfa',
                    secondaryColor: '#3b82f6',
                    tertiaryColor: '#10b981',
                    background: '#1f2937',
                    mainBkg: '#1f2937',
                    secondBkg: '#374151',
                    tertiaryBkg: '#4b5563',
                    textColor: '#e5e7eb',
                    border1: '#6b7280',
                    border2: '#9ca3af',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                },
                flowchart: {
                    useMaxWidth: true,
                    htmlLabels: true,
                    curve: 'basis',
                },
                sequence: {
                    useMaxWidth: true,
                    wrap: true,
                },
                gantt: {
                    useMaxWidth: true,
                },
            });
            mermaidInitialized = true;
        }

        const renderDiagram = async () => {
            if (!chart || !ref.current) return;

            try {
                // Generate a unique ID for this diagram
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

                // Render the diagram
                const { svg: renderedSvg } = await mermaid.render(id, chart);
                setSvg(renderedSvg);
                setError('');
            } catch (err) {
                console.error('Mermaid rendering error:', err);
                setError('Failed to render diagram');
            }
        };

        renderDiagram();
    }, [chart]);

    if (error) {
        return (
            <div className="my-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">⚠️ {error}</p>
                <pre className="mt-2 text-xs text-gray-400 overflow-x-auto">
                    <code>{chart}</code>
                </pre>
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className="my-6 p-6 bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
