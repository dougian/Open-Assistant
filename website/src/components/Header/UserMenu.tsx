import { Box, Link, Text, useColorModeValue } from "@chakra-ui/react";
import { Popover } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import NextLink from "next/link";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { FiAlertTriangle, FiLayout, FiLogOut, FiSettings, FiShield } from "react-icons/fi";

export function UserMenu() {
  const { data: session } = useSession();
  const backgroundColor = useColorModeValue("white", "gray.700");
  const accentColor = useColorModeValue("gray.300", "gray.600");

  if (!session) {
    return <></>;
  }
  if (session && session.user) {
    const accountOptions = [
      {
        name: "Dashboard",
        href: "/dashboard",
        desc: "Dashboard",
        icon: FiLayout,
      },
      {
        name: "Account Settings",
        href: "/account",
        desc: "Account Settings",
        icon: FiSettings,
      },
      {
        name: "Report a Bug",
        href: "https://github.com/LAION-AI/Open-Assistant/issues/new/choose",
        desc: "Report a Bug",
        icon: FiAlertTriangle,
      },
    ];

    if (session.user.role === "admin") {
      accountOptions.unshift({
        name: "Admin Dashboard",
        href: "/admin",
        desc: "Admin Dashboard",
        icon: FiShield,
      });
    }

    return (
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button aria-label="Toggle Account Options" className="flex">
              <Box
                borderWidth="1px"
                borderColor={accentColor}
                className="flex items-center gap-4 p-1 lg:pr-6 rounded-full transition-colors duration-300"
              >
                <Image
                  src={session.user.image || "/images/temp-avatars/av1.jpg"}
                  alt="Profile Picture"
                  width="36"
                  height="36"
                  className="rounded-full"
                ></Image>
                <p data-cy="username" className="hidden lg:flex">
                  {session.user.name || session.user.email}
                </p>
              </Box>
            </Popover.Button>
            <AnimatePresence initial={false}>
              {open && (
                <Box backgroundColor={backgroundColor}>
                  <Popover.Panel
                    static
                    as={motion.div}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      y: -10,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <Box
                      bg={backgroundColor}
                      borderRadius="xl"
                      shadow="base"
                      className="absolute right-0 mt-3 w-screen max-w-xs p-4"
                    >
                      <Box className="flex flex-col gap-1">
                        {accountOptions.map((item) => (
                          <Link
                            as={NextLink}
                            key={item.name}
                            href={item.href}
                            aria-label={item.desc}
                            className="flex items-center"
                            bg={backgroundColor}
                            _hover={{ textDecoration: "none" }}
                          >
                            <div className="p-4">
                              <item.icon className="text-blue-500" aria-hidden="true" />
                            </div>
                            <div>
                              <Text>{item.name}</Text>
                            </div>
                          </Link>
                        ))}
                        <Link
                          className="flex items-center rounded-md cursor-pointer"
                          _hover={{ textDecoration: "none" }}
                          onClick={() => signOut({ callbackUrl: "/" })}
                        >
                          <div className="p-4">
                            <FiLogOut className="text-blue-500" />
                          </div>
                          <div>
                            <Text>Sign Out</Text>
                          </div>
                        </Link>
                      </Box>
                    </Box>
                  </Popover.Panel>
                </Box>
              )}
            </AnimatePresence>
          </>
        )}
      </Popover>
    );
  }
}

export default UserMenu;
