import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { courierNameToCode } from "../utils/courierMap";

const DeliveryTrackingPage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const carrierId = searchParams.get("courier");
    const trackingNumber = searchParams.get("trackingNumber");

    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchTrackingInfo = async () => {
        if (!carrierId || !trackingNumber) {
            setError("배송 정보가 없습니다.");
            return;
        }

        try {
            const response = await fetch("https://apis.tracker.delivery/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "TRACKQL-API-KEY AA51HuzHO9s5OdiVl74IVuhF:F04nertEXN7QAJn1bYI0ikAlbUPhTT0TctJNKPBgGCE",
                },
                body: JSON.stringify({
                    query: `
            query Track($carrierId: ID!, $trackingNumber: String!) {
              track(carrierId: $carrierId, trackingNumber: $trackingNumber) {
                lastEvent {
                  time
                  status {
                    code
                    name
                  }
                  description
                }
                events(last: 10) {
                  edges {
                    node {
                      time
                      status {
                        code
                        name
                      }
                      description
                    }
                  }
                }
              }
            }
          `,
                    variables: {
                        carrierId: courierNameToCode[carrierId],
                        trackingNumber,
                    },
                }),
            });

            const result = await response.json();

            if (result.errors) {
                setError(result.errors[0].message);
            } else {
                const { events } = result.data.track;
                setData(events.edges.map((e: any) => e.node));
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrackingInfo();
    }, []);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러 발생: {error}</div>;

    return (
        <div>
            <h2>배송 추적</h2>
            <ul>
                {data.map((e, idx) => (
                    <li key={idx}>
                        <strong>{e.status.name}</strong> ({e.time})<br />
                        {e.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DeliveryTrackingPage;
