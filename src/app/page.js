import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, FileSpreadsheet, Upload, Table as TableIcon, Download, CheckCircle2, Menu, FileText, Database, Globe, Zap, BarChart, Shield, Users, Sparkles, Rocket, ChevronRight } from "lucide-react";

export default function App() {
    return (
        <div className="flex flex-col min-h-screen font-sans antialiased">
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <FileSpreadsheet className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="font-bold text-xl text-slate-900">DataForge</span>
                            <div className="text-xs text-slate-500 font-medium">CSV Processing</div>
                        </div>
                    </div>

                    <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-700">
                        <Link href="/features" className="hover:text-slate-900 transition-colors font-medium">Features</Link>
                        <Link href="/how-it-works" className="hover:text-slate-900 transition-colors font-medium">How it Works</Link>
                        <Link href="/use-cases" className="hover:text-slate-900 transition-colors font-medium">Use Cases</Link>
                        <Link href="/pricing" className="hover:text-slate-900 transition-colors font-medium">Pricing</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link href="/auth/sign-in" className="hidden md:block text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                            Sign In
                        </Link>
                        <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg transition-all">
                            <Link href="/auth/sign-up">Get Started <ChevronRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-20 md:py-28 lg:py-36 bg-gradient-to-b from-white to-slate-50">
                    <div className="container px-4 md:px-6 relative z-10">
                        <div className="flex flex-col items-center space-y-10 text-center">
                            <div className="space-y-6 max-w-4xl">
                                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 mb-2">
                                    <Zap className="h-4 w-4 text-amber-500" />
                                    No account needed to start
                                </div>
                                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-slate-900">
                                    Transform Spreadsheets into
                                    <span className="block mt-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Actionable Insights
                  </span>
                                </h1>
                                <p className="mx-auto max-w-[700px] text-lg text-slate-600 leading-relaxed">
                                    Upload, parse, and analyze CSV files in seconds. Built for data analysts, developers, and teams who need to work smarter, not harder.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" className="h-14 px-8 text-lg font-medium gap-3 bg-slate-900 hover:bg-slate-800 text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                                    <Upload className="h-5 w-5" />
                                    Upload Your First CSV
                                </Button>
                                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all">
                                    Watch 2-Minute Demo
                                </Button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 w-full max-w-3xl">
                                <div className="text-center p-6 bg-white rounded-xl shadow-sm border">
                                    <div className="text-3xl font-bold text-slate-900">50K+</div>
                                    <div className="text-sm text-slate-600">Files Processed</div>
                                </div>
                                <div className="text-center p-6 bg-white rounded-xl shadow-sm border">
                                    <div className="text-3xl font-bold text-slate-900">99.9%</div>
                                    <div className="text-sm text-slate-600">Uptime</div>
                                </div>
                                <div className="text-center p-6 bg-white rounded-xl shadow-sm border">
                                    <div className="text-3xl font-bold text-slate-900">10GB</div>
                                    <div className="text-sm text-slate-600">File Size Limit</div>
                                </div>
                                <div className="text-center p-6 bg-white rounded-xl shadow-sm border">
                                    <div className="text-3xl font-bold text-slate-900">15+</div>
                                    <div className="text-sm text-slate-600">Export Formats</div>
                                </div>
                            </div>

                            {/* Interactive Demo Preview */}
                            <div className="pt-12 w-full max-w-5xl">
                                <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-1 shadow-2xl overflow-hidden">
                                    <div className="rounded-xl bg-white p-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                                    <FileSpreadsheet className="h-5 w-5 text-slate-600" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">sales_data_2024.csv</div>
                                                    <div className="text-sm text-slate-500">24.5 MB • 15,432 rows • Updated 2 hours ago</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                                <div className="text-sm font-medium text-emerald-600">Ready to analyze</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-8">
                                            <div className="space-y-2">
                                                <div className="text-sm font-medium text-slate-700">Data Preview</div>
                                                <div className="space-y-1">
                                                    {["Customer ID", "Date", "Amount", "Status"].map((col, i) => (
                                                        <div key={i} className="h-4 bg-slate-100 rounded animate-pulse" style={{width: `${80 - i*10}%`}}></div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-sm font-medium text-slate-700">Quick Actions</div>
                                                <div className="space-y-2">
                                                    {["Generate Report", "Export JSON", "Find Duplicates", "Clean Data"].map((action, i) => (
                                                        <div key={i} className="h-6 bg-slate-50 rounded border text-xs flex items-center px-3 text-slate-700">
                                                            {action}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="col-span-2 space-y-4">
                                                <div className="text-sm font-medium text-slate-700">Visualization Preview</div>
                                                <div className="h-32 bg-gradient-to-r from-slate-50 to-white rounded-lg border flex items-center justify-center">
                                                    <div className="flex items-end gap-1">
                                                        {[40, 60, 80, 45, 75, 90, 55].map((height, i) => (
                                                            <div
                                                                key={i}
                                                                className="w-8 bg-gradient-to-t from-slate-300 to-slate-400 rounded-t"
                                                                style={{height: `${height}%`}}
                                                            ></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-slate-50">
                    <div className="container px-4 md:px-6">
                        <div className="text-center space-y-6 mb-16">
                            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                                <Sparkles className="h-4 w-4" />
                                Why Choose DataForge
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-slate-900">
                                Built for the modern data stack
                            </h2>
                            <p className="mx-auto max-w-[700px] text-lg text-slate-600">
                                Professional tools designed to handle real-world data challenges with precision and speed.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    icon: Upload,
                                    title: "Lightning Fast Uploads",
                                    description: "Process multi-gigabyte files in seconds with our optimized streaming parser.",
                                    color: "bg-blue-50 text-blue-700"
                                },
                                {
                                    icon: Shield,
                                    title: "Enterprise Security",
                                    description: "Bank-level encryption, GDPR compliant, and data never leaves your browser.",
                                    color: "bg-emerald-50 text-emerald-700"
                                },
                                {
                                    icon: BarChart,
                                    title: "Smart Analytics",
                                    description: "Auto-detect patterns, anomalies, and generate insights from your data.",
                                    color: "bg-amber-50 text-amber-700"
                                },
                                {
                                    icon: Users,
                                    title: "Team Collaboration",
                                    description: "Share, comment, and work together on datasets in real-time.",
                                    color: "bg-violet-50 text-violet-700"
                                }
                            ].map((feature, index) => (
                                <Card key={index} className="group border border-slate-200 hover:border-slate-300 bg-white hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <div className={`h-12 w-12 rounded-lg ${feature.color.split(' ')[0]} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                                            <feature.icon className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-lg font-semibold text-slate-900">{feature.title}</CardTitle>
                                        <CardDescription className="text-slate-600">{feature.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section id="how-it-works" className="py-24 bg-white">
                    <div className="container px-4 md:px-6">
                        <div className="max-w-3xl mx-auto">
                            <div className="text-center space-y-6 mb-12">
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900">
                                    Simple three-step workflow
                                </h2>
                                <p className="text-lg text-slate-600">
                                    Get from raw data to insights in minutes, not hours.
                                </p>
                            </div>

                            <div className="space-y-8">
                                {[
                                    { step: "01", title: "Upload Your Data", description: "Drag & drop CSV, Excel, or JSON files. No limits on file size." },
                                    { step: "02", title: "Clean & Transform", description: "Use our intuitive tools to filter, sort, and prepare your data." },
                                    { step: "03", title: "Analyze & Export", description: "Generate reports, visualize trends, and export in any format." }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start gap-6 group">
                                        <div className="flex-shrink-0 h-14 w-14 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg font-bold group-hover:scale-110 transition-transform">
                                            {item.step}
                                        </div>
                                        <div className="flex-1 pt-2">
                                            <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                                            <p className="text-slate-600">{item.description}</p>
                                        </div>
                                        {index < 2 && (
                                            <div className="hidden lg:block h-px w-16 bg-slate-200 mt-7 mx-4"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
                    <div className="container px-4 md:px-6 text-center">
                        <div className="max-w-3xl mx-auto space-y-8">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
                                <Rocket className="h-4 w-4" />
                                Limited Time Offer
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
                                Ready to streamline your data workflow?
                            </h2>
                            <p className="text-xl text-slate-300">
                                Join thousands of professionals who have transformed how they work with data.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                                <Button size="lg" className="h-14 px-8 text-lg font-medium bg-white text-slate-900 hover:bg-slate-100 shadow-2xl">
                                    Start Free Trial
                                </Button>
                                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2 border-white/30 bg-transparent text-white hover:bg-white/10">
                                    Schedule a Demo
                                </Button>
                            </div>
                            <div className="flex items-center justify-center gap-6 pt-12 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    No credit card required
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    14-day free trial
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Cancel anytime
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-50 border-t py-12 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                                    <FileSpreadsheet className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-xl text-slate-900">DataForge</div>
                                    <div className="text-sm text-slate-600">Advanced CSV Processing</div>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 max-w-md">
                                Professional data processing tools for analysts, developers, and businesses. Built with performance and security in mind.
                            </p>
                        </div>

                        {[
                            {
                                title: "Product",
                                links: ["Features", "Integrations", "Documentation", "API", "Changelog"]
                            },
                            {
                                title: "Company",
                                links: ["About", "Careers", "Blog", "Press", "Contact"]
                            },
                            {
                                title: "Resources",
                                links: ["Community", "Tutorials", "Support", "Status", "Legal"]
                            }
                        ].map((column, index) => (
                            <div key={index}>
                                <h3 className="font-semibold text-slate-900 mb-4">{column.title}</h3>
                                <ul className="space-y-3">
                                    {column.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <Link href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                                                {link}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-slate-600">© {new Date().getFullYear()} DataForge. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <Link href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Privacy Policy</Link>
                            <Link href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Terms of Service</Link>
                            <Link href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Cookie Policy</Link>
                            <div className="flex gap-3">
                                {[Twitter, LinkedIn, GitHub].map((Icon, i) => (
                                    <div key={i} className="h-8 w-8 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center cursor-pointer">
                                        <Icon className="h-4 w-4 text-slate-600" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Placeholder icons for social links
function Twitter(props) {
    return <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
}

function LinkedIn(props) {
    return <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
}

function GitHub(props) {
    return <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;
}