import React from 'react';
import Image from 'next/image';

export function TopNavBar() {
  return (
    <header className="fixed top-0 w-full z-40 bg-surface/70 backdrop-blur-xl shadow-2xl shadow-black/50">
      <div className="flex justify-between items-center h-16 px-8 ml-64">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">
              search
            </span>
            <input 
              type="text" 
              placeholder="Search creators, subscribers or IDs..." 
              className="w-full bg-surface-container-low/50 border-none rounded-full py-2 pl-12 pr-4 text-sm text-on-surface focus:ring-2 focus:ring-primary transition-all font-body"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-outline hover:bg-surface-container-high/80 p-2 rounded-full transition-colors active:scale-95 duration-200">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="text-outline hover:bg-surface-container-high/80 p-2 rounded-full transition-colors active:scale-95 duration-200">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          
          <div className="h-8 w-[1px] bg-outline-variant/50"></div>
          
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all relative">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkY2iXyWmJskimjpK1A1f2N12_6mVlLN4LlwQZZ0kwoLxObf_7BYT2oZMxb3SdLLSa2dCwW2LpyyDqcscsjxS0iMfDT_TwhF3swtjW8GlEiQRkP8pyHFfYsH6vMbWvErZ0TyE8wUKGDvn7HZOi1K1aD7fdvnWw3n6HiCgPC4SrUxnF8zu2SR2tjK57PmEu5M_QmdKgeWg-hD7X_vjMfQ85ZS1cqQSU5q1XAgbqb_A5pAXjkhZsqfAhLlFSiAfqbZ7NPr9oY2aAQtIu" 
                alt="Alex Rivera Admin Profile"
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
            <div className="hidden lg:block text-right">
              <p className="text-xs font-bold text-on-surface">Alex Rivera</p>
              <p className="text-[10px] text-primary font-medium">Head Curator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
