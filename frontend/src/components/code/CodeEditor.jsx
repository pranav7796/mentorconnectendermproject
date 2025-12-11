import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const CodeEditor = () => {
    const [code, setCode] = useState('// Write your code here\nfunction hello() {\n  console.log("Hello World!");\n}\n\nhello();');
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [submitting, setSubmitting] = useState(false);

    const handleRun = () => {
        // Mock execution for demo
        setOutput('> Running your code...\n> Hello World!\n> Execution completed successfully! ✅');

        setTimeout(() => {
            setOutput(prev => prev + '\n> Output generated at ' + new Date().toLocaleTimeString());
        }, 500);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');

            // Award XP for code submission
            const response = await axios.post('/api/gamification/award-xp',
                { amount: 25 },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setOutput('> Code submitted successfully! ✅\n> +25 XP awarded! 🎉\n> Keep coding to level up!');

            if (response.data.leveledUp) {
                setOutput(prev => prev + `\n> 🎊 ${response.data.message}`);
            }
        } catch (error) {
            console.error(error);
            setOutput('> Error submitting code. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-900">
            {/* Toolbar */}
            <div className="glass-dark p-4 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center gap-4">
                    <h2 className="text-white font-bold text-lg flex items-center gap-2">
                        <span>💻</span>
                        Code Editor
                    </h2>

                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleRun}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                    >
                        <span>▶</span>
                        Run
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 transition-all"
                    >
                        {submitting ? (
                            <>
                                <span className="animate-spin">⏳</span>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <span>📤</span>
                                Submit (+25 XP)
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Editor & Output */}
            <div className="flex-1 flex">
                {/* Code Editor */}
                <div className="flex-1 relative">
                    <Editor
                        height="100%"
                        language={language}
                        value={code}
                        onChange={(value) => setCode(value)}
                        theme="vs-dark"
                        options={{
                            minimap: { enabled: true },
                            fontSize: 14,
                            lineNumbers: 'on',
                            roundedSelection: true,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            tabSize: 2,
                            wordWrap: 'on'
                        }}
                    />
                </div>

                {/* Output Panel */}
                <div className="w-1/3 bg-gray-800 border-l border-gray-700 p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-semibold">Output Console</h3>
                        <button
                            onClick={() => setOutput('')}
                            className="text-xs text-gray-400 hover:text-white transition-colors"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                            {output || '> Click "Run" to execute your code\n> Click "Submit" to earn XP! 🎯'}
                        </pre>
                    </div>

                    {/* Quick Tips */}
                    <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                        <p className="text-xs text-gray-400 mb-2 font-semibold">💡 Quick Tips:</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                            <li>• Write code and click Run to test</li>
                            <li>• Submit to earn 25 XP</li>
                            <li>• Level up by coding regularly!</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
