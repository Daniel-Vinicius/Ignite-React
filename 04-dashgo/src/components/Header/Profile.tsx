import { Flex, Text, Box, Avatar } from "@chakra-ui/react";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps): JSX.Element {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Daniel Vinícius</Text>
          <Text color="gray.300" fontSize="small">
            daniel.vinicius@gmail.com
          </Text>
        </Box>
      )}

      <Avatar
        size="md"
        name="Daniel Vinícius"
        src="https://avatars.githubusercontent.com/u/66279500?v=4"
      />
    </Flex>
  );
}
