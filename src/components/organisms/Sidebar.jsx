import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { name: "Students", href: "/students", icon: "Users" },
    { name: "Courses", href: "/courses", icon: "BookOpen" },
    { name: "Grades", href: "/grades", icon: "GraduationCap" },
    { name: "Schedule", href: "/schedule", icon: "Calendar" },
    { name: "Documents", href: "/documents", icon: "FileText" },
    { name: "Reports", href: "/reports", icon: "BarChart3" },
  ];

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-primary-800 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6 py-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-white">EduHub</h1>
          </div>
        </div>
        <nav className="mt-2 flex-1 px-3 pb-4 space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200",
                  isActive
                    ? "bg-primary-700 text-white"
                    : "text-primary-100 hover:bg-primary-700 hover:text-white"
                )
              }
            >
              <ApperIcon
                name={item.icon}
                className="mr-3 h-5 w-5 flex-shrink-0"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobile}
          className="bg-white p-2 rounded-lg shadow-md"
        >
          <ApperIcon name="Menu" className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-primary-800 transform transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-white">EduHub</h1>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="text-white hover:text-gray-300"
          >
            <ApperIcon name="X" className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-2 px-3 pb-4 space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200",
                  isActive
                    ? "bg-primary-700 text-white"
                    : "text-primary-100 hover:bg-primary-700 hover:text-white"
                )
              }
            >
              <ApperIcon
                name={item.icon}
                className="mr-3 h-5 w-5 flex-shrink-0"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;