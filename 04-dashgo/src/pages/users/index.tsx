import Head from "next/head";
import Link from "next/link";

import { RiAddLine, RiPencilLine } from "react-icons/ri";

import { useUsers } from "../../services/hooks/useUsers";

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
} from "@chakra-ui/react";

import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { Pagination } from "../../components/Pagination";

export default function UserList() {
  const { data, isLoading, isFetching, error } = useUsers();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

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
                    {data.map((user) => {
                      return (
                        <Tr key={user.id}>
                          <Td px={["4", "4", "6"]}>
                            <Checkbox colorScheme="pink" />
                          </Td>
                          <Td>
                            <Box>
                              <Text fontWeight="bold">{user.name}</Text>
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
                  currentPage={5}
                  totalCountOfRegisters={200}
                  onPageChange={() => {}}
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
