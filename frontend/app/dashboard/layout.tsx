import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Dashboard - Sanjivani 2.0',
    description: 'Your farm dashboard - Monitor crops, view analytics, and track alerts',
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Dashboard uses full-screen sidebar layout, no additional wrappers needed
    return children;
}
