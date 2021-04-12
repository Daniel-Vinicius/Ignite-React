import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import { queryClient } from "../../services/queryClient";
import { api } from "../../services/api";

import { getUsers, useUsers } from "../../services/hooks/useUsers";

import { RiAddLine, RiPencilLine } from "react-icons/ri";

import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Table,
  Tr,
  Th,
  Td,
  Thead,
  Tbody,
  Text,
  useBreakpointValue,
  Spinner,
  Link as ChakraLink,
} from "@chakra-ui/react";

import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { Pagination } from "../../components/Pagination";
import { GetServerSideProps } from "next";

// type User = {
//   id: string;
//   name: string;
//   email: string;
//   createdAt: string;
// };

// type UserListProps = {
//   totalCount: number;
//   users: User[];
// };

// export default function UserList(props: UserListProps)
export default function UserList() {
  const [page, setPage] = useState(1);

  // const { data, isLoading, isFetching, error } = useUsers(page, {
  //   initialData: props,
  // });

  const { data, isLoading, isFetching, error } = useUsers(page);

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  async function handlePrefetchUser(userId: string) {
    await queryClient.prefetchQuery(
      ["user", userId],
      async () => {
        const response = await api.get(`users/${userId}`);

        return response.data;
      },
      {
        staleTime: 1000 * 60 * 10, // 10 minutes
      }
    );
  }

  return (
    <>
      <Head>
        <title>DashGo | Usuários</title>
      </Head>
      <Box>
        <Header />

        <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
          <Sidebar />

          <Box flex="1" borderRadius={8} bg="gray.800" p="8">
            <Flex mb="8" justify="space-between" align="center">
              <Heading size="lg" fontWeight="normal">
                Usuários
                {!isLoading && isFetching && (
                  <Spinner size="sm" color="gray.500" ml="4" />
                )}
              </Heading>
              <Link href="/users/create" passHref>
                <Button
                  as="a"
                  size="sm"
                  fontSize="small"
                  colorScheme="pink"
                  leftIcon={<Icon as={RiAddLine} fontSize={16} />}
                >
                  Criar novo
                </Button>
              </Link>
            </Flex>
            {isLoading ? (
              <Flex justify="center">
                <Spinner />
              </Flex>
            ) : error ? (
              <Flex justify="center">
                <Text>Falha ao obter dados dos usuários</Text>
              </Flex>
            ) : (
              <>
                <Table colorScheme="whiteAlpha">
                  <Thead>
                    <Tr>
                      <Th px={["4", "4", "6"]} color="gray.300" width="8">
                        <Checkbox colorScheme="pink" />
                      </Th>
                      <Th>Usuário</Th>
                      {isWideVersion && <Th>Data de cadastro</Th>}
                      {isWideVersion && <Th w="8"></Th>}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.users.map((user) => {
                      return (
                        <Tr key={user.id}>
                          <Td px={["4", "4", "6"]}>
                            <Checkbox colorScheme="pink" />
                          </Td>
                          <Td>
                            <Box>
                              <ChakraLink
                                color="purple.400"
                                onMouseEnter={() => handlePrefetchUser(user.id)}
                              >
                                <Text fontWeight="bold">{user.name}</Text>
                              </ChakraLink>
                              <Text color="gray.300" fontSize="sm">
                                {user.email}
                              </Text>
                            </Box>
                          </Td>
                          {isWideVersion && <Td>{user.createdAt}</Td>}
                          {isWideVersion && (
                            <Td>
                              <Button
                                as="a"
                                size="sm"
                                fontSize="small"
                                colorScheme="purple"
                                leftIcon={
                                  <Icon as={RiPencilLine} fontSize={16} />
                                }
                              >
                                Editar
                              </Button>
                            </Td>
                          )}
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                <Pagination
                  currentPage={page}
                  totalCountOfRegisters={data.totalCount}
                  onPageChange={setPage}
                  siblingsCount={1}
                />
              </>
            )}
          </Box>
        </Flex>
      </Box>
    </>
  );
}

// React Query With SSR

// export const getServerSideProps: GetServerSideProps = async () => {
// Error Not Found -> const { users, totalCount } = await getUsers(1);

//   return {
//     props: {
//       users,
//       totalCount,
//     },
//   };
// };
