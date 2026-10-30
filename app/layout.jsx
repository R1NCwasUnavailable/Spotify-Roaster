import "./globals.css";

export const metadata = {
  title: "Spotify Roast App | Let AI Destroy Your Music Taste",
  description: "Connect your Spotify and get an uncensored, brutally honest AI roast of your top artists, embarrassing genres, and questionable repeats.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-spotify-black text-spotify-white min-h-screen selection:bg-spotify-green selection:text-black">
        {children}
      </body>
    </html>
  );
}

