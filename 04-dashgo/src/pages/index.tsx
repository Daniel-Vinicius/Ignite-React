import Head from "next/head";
import { SubmitHandler, useForm } from "react-hook-form";

import { Flex, Button, Stack } from "@chakra-ui/react";

import { Input } from "../components/Form/Input";

type SignInFormData = { email: string; password: string };

export default function SignIn() {
  const { register, handleSubmit, formState, errors } = useForm();

  console.log(errors);

  const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(values);
  };

  return (
    <>
      <Head>
        <title>DashGo</title>
      </Head>
      <Flex w="100vw" h="100vh" align="center" justify="center">
        <Flex
          as="form"
          w="100%"
          maxWidth="22.5rem"
          bg="gray.800"
          p="8"
          borderRadius={8}
          flexDir="column"
          onSubmit={handleSubmit(handleSignIn)}
        >
          <Stack spacing="4">
            <Input
              name="email"
              label="E-mail"
              type="email"
              ref={register({ required: "E-mail é obrigatório" })}
              error={errors.email}
            />
            <Input
              name="password"
              label="Senha"
              type="password"
              ref={register}
            />
          </Stack>

          <Button
            type="submit"
            mt="6"
            colorScheme="pink"
            size="lg"
            isLoading={formState.isSubmitting}
          >
            Entrar
          </Button>
        </Flex>
      </Flex>
    </>
  );
}
