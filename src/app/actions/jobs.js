// app/actions/getJobs.js
"use server";

export async function getJobs(options = {}) {
    try {
        // Build URL with query parameters if needed
        let url = `${process.env.API_URL}/api/jobs`;

        // Add query parameters if provided in options
        const queryParams = new URLSearchParams();
        if (options.department)
            queryParams.append("department", options.department);
        if (options.limit) queryParams.append("limit", options.limit);
        if (options.page) queryParams.append("page", options.page);
        if (options.sortBy) queryParams.append("sortBy", options.sortBy);
        if (options.order) queryParams.append("order", options.order);

        const queryString = queryParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // Ensure we get fresh data
            cache: "no-store",
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to fetch jobs");
        }

        const data = await response.json();

        return {
            success: true,
            data: data,
            message: "Jobs fetched successfully",
        };
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return {
            success: false,
            data: [],
            message: error.message || "Failed to fetch jobs",
        };
    }
}

export async function getJobReport(jobId) {
    try {
        const response = await fetch(
            `${process.env.API_URL}/api/jobs/${jobId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store", // Disable caching to always get fresh data
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch job details");
        }

        const data = await response.json();
        return {
            success: true,
            data: data,
        };
    } catch (error) {
        console.error("Error fetching job details:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch job details",
        };
    }
}
