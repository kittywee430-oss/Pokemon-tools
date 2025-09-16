'use client';

import { useState } from 'react';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const tools: Tool[] = [
  {
    id: 'matchup-tracker',
    name: 'PTCGLive Matchup Tracker',
    description: 'Track your Pokemon TCG Live matchups and analyze win rates',
    icon: '🎯'
  },
  {
    id: 'tournament-tracker',
    name: 'Tournament Tracker',
    description: 'Track tournaments with standings, BO3/BO1 support, and detailed statistics',
    icon: '🏆'
  },
];

interface ToolHubProps {
  onSelectTool: (toolId: string) => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  onExportAll: () => void;
  onImportAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ToolHub({ onSelectTool, darkMode, onDarkModeToggle, onExportAll, onImportAll }: ToolHubProps) {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Pokemon TCG Toolbox</h1>
          <p className="text-gray-600">Select a tool to get started</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onExportAll}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Export All Data
          </button>
          <label className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
            Import All Data
            <input
              type="file"
              accept=".json"
              onChange={onImportAll}
              className="hidden"
            />
          </label>
          <button
            onClick={onDarkModeToggle}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-blue-300"
          >
            <div className="text-4xl mb-4">{tool.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
            <p className="text-gray-600">{tool.description}</p>
            <div className="mt-4 text-blue-500 font-medium">Click to open →</div>
          </div>
        ))}
      </div>
    </div>
  );
}