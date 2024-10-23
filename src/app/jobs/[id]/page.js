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
} from "lucide-react";
import { getJobReport } from "@/app/actions/jobs";
import { getStatusBadgeForJob } from "../page";

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

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <button
                    onClick={() => router.push("/jobs")}
                    className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Jobs List
                </button>
            </div>

            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                Job Details: {job.jobId}
            </h1>

            {/* Job Overview Card */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
                <div className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                File Name
                            </div>
                            <div className="mt-1 text-lg text-gray-900 dark:text-gray-100 flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                {job.fileName}
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Status
                            </div>
                            <div className="mt-1">
                                {getStatusBadgeForJob(job.status)}
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Created At
                            </div>
                            <div className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                                {new Date(job.createdAt).toLocaleString()}
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Progress
                            </div>
                            <div className="mt-1">
                                <div className="text-lg text-gray-900 dark:text-gray-100">
                                    {job.successCount + job.failureCount} /{" "}
                                    {job.totalRecipients}
                                </div>
                                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${
                                                ((job.successCount +
                                                    job.failureCount) /
                                                    job.totalRecipients) *
                                                100
                                            }%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Success Rate
                            </div>
                            <div className="mt-1 text-lg text-green-600 dark:text-green-400">
                                {(
                                    (job.successCount / job.totalRecipients) *
                                    100
                                ).toFixed(1)}
                                %
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Department Breakdown */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        Department Breakdown
                    </h3>

                    {job?.departments?.map((dept) => (
                        <div
                            key={dept.name}
                            className="mb-4 border rounded-lg dark:border-gray-700"
                        >
                            <div className="p-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        {dept.name}
                                    </h4>
                                    <button
                                        onClick={() =>
                                            toggleDepartmentExpansion(dept.name)
                                        }
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        {expandedDepartments[dept.name] ? (
                                            <ChevronUp className="h-5 w-5" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>

                                <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
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
                                            Failed:
                                        </span>
                                        <span className="ml-2 text-red-600 dark:text-red-400">
                                            {dept.stats.failed}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Pending:
                                        </span>
                                        <span className="ml-2 text-yellow-600 dark:text-yellow-400">
                                            {dept.stats.pending}
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
                                                            Sent At
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                    {dept.recipients.map(
                                                        (recipient, index) => (
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
                                                                <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                                                    {recipient.sentAt
                                                                        ? new Date(
                                                                              recipient.sentAt
                                                                          ).toLocaleString()
                                                                        : "-"}
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
        </div>
    );
};

export default SingleJobReportPage;
