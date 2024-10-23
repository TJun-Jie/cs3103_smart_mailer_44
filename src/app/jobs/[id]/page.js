"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    FileText,
    Mail,
    Users,
    Calendar,
    ChevronDown,
    ChevronUp,
    Loader2,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ArrowLeft,
    Eye,
    EyeOff,
    Clock,
} from "lucide-react";
import { getJobReport } from "@/app/actions/jobs";
import { getStatusBadgeForJob } from "../page";

const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    className = "",
}) => (
    <div className={`p-4 rounded-lg ${className}`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {title}
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {value}
                </p>
                {description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {description}
                    </p>
                )}
            </div>
            <Icon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
    </div>
);

const getStatusBadge = (status) => {
    const baseClasses =
        "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1";
    switch (status) {
        case "sent":
            return (
                <span
                    className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100`}
                >
                    <CheckCircle2 className="w-3 h-3" />
                    Sent
                </span>
            );
        case "processing":
            return (
                <span
                    className={`${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100`}
                >
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Processing
                </span>
            );
        case "failed":
            return (
                <span
                    className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100`}
                >
                    <XCircle className="w-3 h-3" />
                    Failed
                </span>
            );
        default:
            return (
                <span
                    className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100`}
                >
                    <AlertCircle className="w-3 h-3" />
                    {status}
                </span>
            );
    }
};

const SingleJobReportPage = ({ params }) => {
    const router = useRouter();
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedDepartments, setExpandedDepartments] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        if (params.id) {
            fetchJobData(params.id);
        }
    }, [params.id]);

    const fetchJobData = async (jobId) => {
        setIsLoading(true);
        try {
            const data = await getJobReport(jobId);
            console.log(data);
            setJob(data.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    console.log(job);

    const toggleDepartmentExpansion = (departmentName) => {
        setExpandedDepartments((prev) => ({
            ...prev,
            [departmentName]: !prev[departmentName],
        }));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-400 p-4">
                    <p className="text-red-700 dark:text-red-100">
                        {error || "Job not found"}
                    </p>
                </div>
            </div>
        );
    }

    const renderTotalStats = () => {
        if (!job?.totalStats) return null;

        const stats = job.totalStats;
        const totalDelivered = stats.sent + stats.failed;

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Total Recipients"
                    value={job.totalRecipients}
                    icon={Users}
                    description="Total emails to be sent"
                    className="bg-white dark:bg-gray-800 shadow-sm"
                />
                <StatCard
                    title="Delivery Rate"
                    value={`${(
                        (totalDelivered / job.totalRecipients) *
                        100
                    ).toFixed(1)}%`}
                    icon={Mail}
                    description={`${stats.sent} delivered, ${stats.failed} failed`}
                    className="bg-white dark:bg-gray-800 shadow-sm"
                />
                <StatCard
                    title="Read Rate"
                    value={`${stats.readRate.toFixed(1)}%`}
                    icon={Eye}
                    description={`${stats.read} opened, ${stats.unread} unopened`}
                    className="bg-white dark:bg-gray-800 shadow-sm"
                />
                <StatCard
                    title="Processing Time"
                    value={
                        job.status === "completed" ? "Completed" : "In Progress"
                    }
                    icon={Clock}
                    description={new Date(job.createdAt).toLocaleString()}
                    className="bg-white dark:bg-gray-800 shadow-sm"
                />
            </div>
        );
    };

    const getReadStatusBadge = (hasRead, readAt) => {
        const baseClasses =
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
        if (hasRead) {
            return (
                <span
                    className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100`}
                >
                    <Eye className="mr-1 h-3 w-3" />
                    Read {readAt && `at ${new Date(readAt).toLocaleString()}`}
                </span>
            );
        }
        return (
            <span
                className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100`}
            >
                <EyeOff className="mr-1 h-3 w-3" />
                Unread
            </span>
        );
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => router.push("/jobs")}
                    className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Jobs List
                </button>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <XCircle className="h-5 w-5 text-red-400" />
                        <div className="ml-3">
                            <p className="text-sm text-red-700 dark:text-red-200">
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            ) : (
                job && (
                    <>
                        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                            Job Report: {job.jobId}
                        </h1>

                        {/* Total Stats Cards */}
                        {renderTotalStats()}

                        {/* Department Breakdown */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Department Breakdown
                                </h3>

                                {job.departments.map((dept) => (
                                    <div
                                        key={dept.name}
                                        className="mb-4 border rounded-lg dark:border-gray-700"
                                    >
                                        <div className="p-4">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                                    {dept.name}
                                                </h4>
                                                <div className="flex items-center space-x-4">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        Read Rate:{" "}
                                                        {dept.stats.readRate.toFixed(
                                                            1
                                                        )}
                                                        %
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            toggleDepartmentExpansion(
                                                                dept.name
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        {expandedDepartments[
                                                            dept.name
                                                        ] ? (
                                                            <ChevronUp className="h-5 w-5" />
                                                        ) : (
                                                            <ChevronDown className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-2 grid grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Total:
                                                    </span>
                                                    <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                                                        {dept.count}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Sent:
                                                    </span>
                                                    <span className="ml-2 text-green-600 dark:text-green-400">
                                                        {dept.stats.sent}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Read:
                                                    </span>
                                                    <span className="ml-2 text-blue-600 dark:text-blue-400">
                                                        {dept.stats.read}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Failed:
                                                    </span>
                                                    <span className="ml-2 text-red-600 dark:text-red-400">
                                                        {dept.stats.failed}
                                                    </span>
                                                </div>
                                            </div>

                                            {expandedDepartments[dept.name] && (
                                                <div className="mt-4 border-t dark:border-gray-700 pt-4">
                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                            <thead>
                                                                <tr>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                                                                        Name
                                                                    </th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                                                                        Email
                                                                    </th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                                                                        Status
                                                                    </th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                                                                        Read
                                                                        Status
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                                {dept.recipients.map(
                                                                    (
                                                                        recipient
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                recipient.email
                                                                            }
                                                                        >
                                                                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                                                                                {
                                                                                    recipient.name
                                                                                }
                                                                            </td>
                                                                            <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                                                                {
                                                                                    recipient.email
                                                                                }
                                                                            </td>
                                                                            <td className="px-4 py-2 text-sm">
                                                                                {getStatusBadge(
                                                                                    recipient.status
                                                                                )}
                                                                            </td>
                                                                            <td className="px-4 py-2 text-sm">
                                                                                {getReadStatusBadge(
                                                                                    recipient.hasRead,
                                                                                    recipient.readAt
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )
            )}
        </div>
    );
};

export default SingleJobReportPage;
