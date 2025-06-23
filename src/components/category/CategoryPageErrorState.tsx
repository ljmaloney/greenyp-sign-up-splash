
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";

const CategoryPageErrorState = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        <p className="mb-8">We couldn't find the category you're looking for.</p>
        <Link to="/">
          <Button>Return to Home</Button>
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPageErrorState;
