import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'BarChart3' },
    { name: 'Students', href: '/students', icon: 'Users' },
    { name: 'Courses', href: '/courses', icon: 'BookOpen' },
    { name: 'Grades', href: '/grades', icon: 'GraduationCap' },
    { name: 'Schedule', href: '/schedule', icon: 'Calendar' },
    { name: 'Documents', href: '/documents', icon: 'FileText' },
    { name: 'Reports', href: '/reports', icon: 'TrendingUp' },
  ];

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

// Desktop Sidebar
  const DesktopSidebar = () => (

const DesktopSidebar = () => (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 border-r border-gray-200">
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900">EduHub</span>
          </div>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          isActive
                            ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50',
                          'group flex gap-x-3 rounded-l-md p-2 text-sm leading-6 font-medium transition-colors'
                        )
                      }
                    >
                      <ApperIcon
                        name={item.icon}
                        className="h-5 w-5 shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
            {/* User info and logout */}
            <li className="mt-auto">
              {isAuthenticated && user && (
                <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-medium text-gray-900">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">
                      {user.firstName?.[0] || user.name?.[0] || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{user.emailAddress || user.email}</p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
              >
                <ApperIcon name="LogOut" className="h-5 w-5 mr-3" />
                Logout
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );

  const MobileSidebar = () => (
    <>
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-white px-4 py-2 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">E</span>
            </div>
            <span className="text-lg font-bold text-gray-900">EduHub</span>
          </div>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            <ApperIcon name={isMobileOpen ? "X" : "Menu"} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6">
              <div className="flex h-16 shrink-0 items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">EduHub</span>
                </div>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-600"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <ApperIcon name="X" className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <NavLink
                            to={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={({ isActive }) =>
                              cn(
                                isActive
                                  ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50',
                                'group flex gap-x-3 rounded-l-md p-2 text-sm leading-6 font-medium transition-colors'
                              )
                            }
                          >
                            <ApperIcon
                              name={item.icon}
                              className="h-5 w-5 shrink-0"
                              aria-hidden="true"
                            />
                            {item.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="mt-auto">
                    {isAuthenticated && user && (
                      <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-medium text-gray-900">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium text-sm">
                            {user.firstName?.[0] || user.name?.[0] || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500">{user.emailAddress || user.email}</p>
                        </div>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logout}
                      className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
                    >
                      <ApperIcon name="LogOut" className="h-5 w-5 mr-3" />
                      Logout
                    </Button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
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