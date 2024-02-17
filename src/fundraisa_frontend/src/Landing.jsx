import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./components/ui/button";
import { AuthClient } from "@dfinity/auth-client";
import { useNavigate } from "react-router-dom";


// Landing page make sure listed campaigns are displayed and user can signup/login
const Landing = () => {
  const navigate = useNavigate();
  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      const authClient = await AuthClient.create();
      await authClient.login({
        identityProvider: process.env.II_URL,
        onSuccess: () => {
          console.log("Logged in!");
          navigate("/campaigns");
        },
      }).catch((error) => {
        console.error("Login failed:", error);
      });
    } catch (error) {
      console.error("AuthClient creation failed:", error);
    }
  };

  return (
    <>
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
        <img alt="Logo" className="" src="9-logo5.png" width="255" height="255"/>
          <span className="sr-only">Acme Inc</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link onClick={handleSignIn} className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Create Campaign
          </Link>
          <Link onClick={handleSignIn} className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Donate
          </Link>
        </nav>
      </header>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Fund Your Dreams</h1>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed 
                dark:text-gray-400">
                Creating a community that believes in the power of collective action to transform lives.
              </p>
            </div>
            <form className="flex flex-col gap-2 min-[400px]:flex-row sm:gap-4">
              <Button onClick={(event) => handleSignIn(event)} size="lg">
                Sign In
                </Button>
            </form>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-300 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Us</h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Fundraisa is a cutting-edge fundraising platform built on the Internet Computer, designed to democratize
              the process of raising funds for personal goals. Our mission is to make dreams a reality by connecting
              individuals with the resources they need to achieve their ambitions. With Fundraisa, you're not just
              donating money—you're investing in someone's journey towards success. Join us today and be part of a
              community that believes in the power of collective action to transform lives.
            </p>
            <form className="flex flex-col gap-2 min-[400px]:flex-row sm:gap-4">
              <Button onClick={(event) => handleSignIn(event)} size="lg"><Link to="/campaigns">
                Learn More
                </Link></Button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
};

export default Landing;
