import { UserProfile } from "@auth0/nextjs-auth0/client";
import { ArrowLeftOnRectangleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useRef } from "react";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useRouter } from "next/navigation";

interface Auth0ConnectionProps {
  user: UserProfile;
  isLoading: boolean;
}
const Auth0Connection = ({ user, isLoading }: Auth0ConnectionProps) => {
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const router = useRouter();
  const closeDropdown = () => {
    dropdownRef.current?.removeAttribute("open");
  };
  useOutsideClick(dropdownRef, closeDropdown);
  const handleLogout = () => {
    router.push("/api/auth/logout");
  };
  return (
    <details ref={dropdownRef} className="dropdown dropdown-end leading-3">
      <summary tabIndex={0} className="btn btn-primary btn-md px-2 shadow-md dropdown-toggle gap-0 rounded-xl">
        {isLoading ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : (
          <>
            <Image width={35} height={35} src={(user.picture as string) || ""} alt={""} className="rounded-md" />
            <span className="ml-3 mr-2">{user.nickname}</span>
            <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
          </>
        )}
      </summary>
      <ul
        tabIndex={0}
        className="dropdown-content menu z-[2] p-2 mt-1 shadow-center shadow-accent bg-base-200 rounded-box gap-1"
      >
        <li className="menu-item btn-sm !rounded-xl flex gap-3 py-3">{user.name}</li>
        {user.org_id && <li className="menu-item btn-sm !rounded-xl flex gap-3 py-3">{user.org_id}</li>}
        <li>
          <button
            className="menu-item text-error btn-sm !rounded-xl flex gap-3 py-3"
            type="button"
            onClick={() => {
              handleLogout();
            }}
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-4 ml-2 sm:ml-0" /> <span>Disconnect</span>
          </button>
        </li>
      </ul>
    </details>
  );
};

export default Auth0Connection;
