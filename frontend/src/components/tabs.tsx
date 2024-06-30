import React, { useState, ReactNode } from 'react';
import { BsChatText, BsSearch } from "react-icons/bs";
import { AiTwotoneMessage } from "react-icons/ai";
import { actions, useAppDispatch, useAppSelector } from 'store/provider';
import 'styles/tabs.css';

interface Tab {
  label: string;
  icon: ReactNode;
}

const Tabs = ({ query }) => {
  const llm_toggle = useAppSelector((state) => state.llm_toggle);
  const tabs: Tab[] = [{ label: "Search", icon: "🔍" }]
  if (llm_toggle) {
    tabs.push({ label: "Chat", icon: <AiTwotoneMessage className="mr-2 text-black" /> });
  }
  const activeTab = useAppSelector((state) => state.activeTab);
  const dispatch = useAppDispatch();
  const setActiveTab = (label: string) => {
    if (!query.trim().length && label == "Search") { //When switched to search tab from chat tab with no query (Possible when user searches with documents from intial screen and lands directly into chat tab)
      window.location.href = "/";
    }
    else {
      label==="Search" && dispatch(actions.setChatContext({ chatContext: {} }))
      dispatch(actions.setActiveTab({ activeTab: label }));
    }
  }
  return (
    <div className="flex cursor-pointer gap-1">
      {tabs.map(({ label, icon }, index) => (
        <div
          key={index}
          className={`flex flex-row  py-1 px-3 items-center ${activeTab === label ? `text-slate-700 rounded-t-lg  ${activeTab==='Chat'?'bg-[#eeeeee]':'bg-white'}`: 'text-slate-200'}`}
          onClick={() => setActiveTab(label)}
        >
          {icon}
          {label}
        </div>
      ))}
    </div>
  );
};

export default Tabs;