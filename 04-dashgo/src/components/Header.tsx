import { Flex, Text } from "@chakra-ui/react";

import { Profile } from "./Header/Profile";
import { NotificationsNav } from "./Header/NotificationsNav";
import { SearchBox } from "./Header/SearchBox";
import { Logo } from "./Header/Logo";

export function Header(): JSX.Element {
  return (
    <Flex
      as="header"
      w="100%"
      maxWidth={1480}
      h="20"
      mx="auto"
      mt="4"
      align="center"
      px="6"
    >
      <Logo />
      <SearchBox />
      <Flex align="center" ml="auto">
        <NotificationsNav />
        <Profile />
      </Flex>
    </Flex>
  );
}
