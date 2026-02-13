"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { exchangeCodeForToken } from "@/lib/spotify";
import { Suspense } from "react";

function CallbackHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const code = searchParams.get("code");
        const authError = searchParams.get("error");

        if (authError) {
            setError(`Spotify authorization was denied: ${authError}`);
            return;
        }

        if (!code) {
            setError("No authorization code received from Spotify.");
            return;
        }

        exchangeCodeForToken(code)
            .then(() => {
                // Redirect back to the main page — it will pick up the pending tracks
                router.replace("/");
            })
            .catch((err) => {
                setError(err.message || "Failed to complete Spotify login.");
            });
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-base-300 flex items-center justify-center">
            <div className="card bg-base-100 shadow-xl p-8 max-w-md w-full text-center">
                {error ? (
                    <>
                        <div className="text-error text-5xl mb-4">✕</div>
                        <h2 className="text-xl font-bold text-error mb-2">
                            Authorization Failed
                        </h2>
                        <p className="text-sm opacity-70 mb-6">{error}</p>
                        <a href="/" className="btn btn-primary">
                            Back to Home
                        </a>
                    </>
                ) : (
                    <>
                        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                        <h2 className="text-xl font-bold mb-2">Connecting to Spotify...</h2>
                        <p className="text-sm opacity-70">
                            Please wait while we complete the authorization.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default function CallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-base-300 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            }
        >
            <CallbackHandler />
        </Suspense>
    );
}
