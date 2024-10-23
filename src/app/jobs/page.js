"use client";
import React, { useState, useEffect } from "react";
import {
    Eye,
    Users,
    FileText,
    Loader2,
    CheckCircle2,
    XCircle,
    AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getJobs } from "../actions/jobs";
export const getStatusBadgeForJob = (status) => {
    const baseClasses =
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
        case "completed":
            return (
                <span
                    className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100`}
                >
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Completed
                </span>
            );
        case "processing":
            return (
                <span
                    className={`${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100`}
                >
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Processing
                </span>
            );
        case "failed":
            return (
                <span
                    className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100`}
                >
                    <XCircle className="mr-1 h-3 w-3" />
                    Failed
                </span>
            );
        default:
            return (
                <span
                    className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100`}
                >
                    <AlertCircle className="mr-1 h-3 w-3" />
                    {status}
                </span>
            );
    }
};

const JobsTablePage = () => {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const result = await getJobs();
            if (result.success) {
                setJobs(result.data);
                setError(null);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Jobs Dashboard
            </h1>
            {isLoading ? (
                <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Job ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    File Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Department
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Progress
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                            {jobs.map((job) => (
                                <tr
                                    key={job.jobId}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {job.jobId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {job.fileName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {job.departmentCode === "all"
                                            ? "All"
                                            : job.departmentCode}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadgeForJob(job.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        <div className="flex items-center">
                                            <Users className="mr-2 h-4 w-4" />
                                            <span>
                                                {job.successCount +
                                                    job.failureCount}{" "}
                                                / {job.totalRecipients}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                                            <div
                                                className="bg-blue-600 dark:bg-blue-400 h-1.5 rounded-full transition-all duration-500"
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
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {new Date(
                                            job.createdAt
                                        ).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `/jobs/${job.jobId}`
                                                )
                                            }
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                                        >
                                            <FileText className="mr-2 h-4 w-4" />
                                            View Report
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default JobsTablePage;
