import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom"; // Make sure this is at the top
import Header from "../components/Header";


const feedConfigs = {
    business: {
        title: "Business Buzz",
        image: "/buzz.jpg",
        rss: [
            "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
            "https://www.etnownews.com/feeds/gns-etn-markets",
            "https://economictimes.indiatimes.com/news/rssfeeds/1715249553.cms",
            "https://www.etnownews.com/feeds/gns-etn-companies",
        ],
    },
    market: {
        title: "Market Pulse",
        image: "/pulse.jpg",
        rss: [
            "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
            "https://www.etnownews.com/feeds/gns-etn-markets",
        ],
    },
    sports: {
        title: "Sports Sportlights",
        image: "/sports.jpg",
        rss: [
            "https://timesofindia.indiatimes.com/rssfeeds/4719148.cms",
            "https://www.livemint.com/rss/sports",
        ],
    },
    tech: {
        title: "Technove",
        image: "/headlines.jpg",
        rss: [
            "https://economictimes.indiatimes.com/tech/rssfeeds/13357270.cms",
            "https://www.etnownews.com/feeds/gns-etn-technology",
        ],
    },
};

function NewsFeedPage() {
    const { type } = useParams();
    console.log(type, "typetype")
    const [feeds, setFeeds] = useState([]);
    const [loading, setLoading] = useState(true);

    const config = feedConfigs[type];
    console.log(config, "(((((((((((")

    useEffect(() => {
        if (!config) return;

        const urls = config.rss.map(
            (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
        );

        const fetchFeeds = async () => {
            try {
                const responses = await Promise.all(
                    urls.map((url) => fetch(url).then((res) => res.json()))
                );

                const parser = new DOMParser();
                const allItems = responses.flatMap((response) => {
                    const xml = parser.parseFromString(response.contents, "text/xml");
                    const items = Array.from(xml.querySelectorAll("item"));
                    return items.map((item) => {
                        const title = item.querySelector("title")?.textContent;
                        const link = item.querySelector("link")?.textContent;
                        const description = item.querySelector("description")?.textContent;
                        const imgMatch = description?.match(/<img[^>]+src="([^">]+)"/);
                        const image = imgMatch ? imgMatch[1] : null;
                        return { title, link, description, image };
                    });
                });

                setFeeds(allItems);
            } catch (error) {
                console.error("Error fetching feeds", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeeds();
    }, [type, config]);

    if (!config) {
        return <div className="p-8 text-red-500 text-lg">Invalid news type: {type}</div>;
    }

    return (
        <><Header /><div className="min-h-screen bg-white mt-20 px-6 py-10 sm:px-12 lg:px-32">
            <h1 className="text-xs sm:text-sm font-medium mb-6 text-gray-400">
                <Link to="/Dashboard">
                    <span className="hover:underline cursor-pointer text-gray-500">Home</span>
                </Link>
                {" / "}
                <Link to="/trending">
                    <span className="hover:underline cursor-pointer text-gray-500">What's Trending</span>
                </Link>
                {" / "}
                <span className="font-bold text-sm sm:text-[16px] text-black font-header">
                    {config.title}
                </span>
            </h1>

            {/* Top Card */}
            {/* <div className="mb-10">
        <div >
            <img
                src={config.image}
                alt={config.title}
                className="w-full h-[800px] sm:h-[400px]  transition-all duration-500 "
            />
            <div >
                <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                    <div className="text-black">

                        <h1 className="text-base font-medium mt-1">{config.subtitle}</h1>
                        <p className="text-sm font-content">{config.description}</p>
                    </div>

                </div>
            </div>
        </div>
    </div> */}
            <div className="mb-10 relative">
                {/* Background Image */}
                <img
                    src={config.image}
                    alt={config.title}
                    className="w-full h-[800px] sm:h-[400px]" />

                {/* Overlay Content (Always Visible) */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/60 px-4 py-3">
                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                        <div className="text-black">
                            <h2 className="text-lg sm:text-xl font-bold flex font-header gap-2">
                                {/* <img src="/ball.png" alt="News Icon" className="w-5 h-5 sm:w-6 sm:h-6" /> */}
                                {config.title}
                            </h2>
                            <h1 className="text-base font-medium mt-1">{config.subtitle || "Explore More!"}</h1>
                            <p className="text-sm font-content">
                                {config.description || "Catch the latest updates, insights, and headlines in this category."}
                            </p>
                        </div>
                        <a href="#news-list">

                        </a>
                    </div>
                </div>
            </div>


            {/* Feed List */}
            <div id="news-list">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Latest {config.title}</h2>

                {loading ? (
                    <p className="text-gray-500 text-sm">Loading articles...</p>
                ) : (
                    <ul className="space-y-6">
                        {feeds.map((item, idx) => (
                            <li
                                key={idx}
                                className="bg-gray-50 rounded-md shadow hover:shadow-md transition overflow-hidden"
                            >
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col sm:flex-row gap-4 p-4"
                                >
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt="News"
                                            className="w-full sm:w-48 h-32 object-cover rounded-md" />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-blue-700 hover:underline">
                                            {item.title}
                                        </h3>
                                        <p
                                            className="text-sm text-gray-700 mt-1"
                                            dangerouslySetInnerHTML={{ __html: item.description }} />
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div></>
    );
}

export default NewsFeedPage;
