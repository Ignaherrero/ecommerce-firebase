import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Flex,
  FormControl,
  HStack,
  Image,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Slide,
  Text,
  Textarea,
  UnorderedList,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import {
  db,
  signInWithGoogle,
  uploadImage,
} from "../../firebase/firebase-config";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { getDownloadURL } from "firebase/storage";
import { nanoid } from "nanoid";
import { ContextLogin } from "../../context/login-context";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default function Productos() {
  const [products, setProducts] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [urlImage, setUrlImage] = useState("");
  const [image, setImage] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [progress, setProgress] = useState(0);
  const { login, setLogin } = useContext(ContextLogin);

  useEffect(() => {
    if (localStorage.getItem("products")) {
      setProducts(JSON.parse(localStorage.getItem("products")));
    } else if (login) {
      setIsLoading(false);
      const getData = async () => {
        const docRef = await getDocs(query(collection(db, "article")));
        setProducts(docRef.docs.map((item) => item.data()));
      };
      getData();
      setIsLoading(false);
    }
  }, [isLoading, isDelete]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    await setDoc(doc(db, "article", data.product), {
      product: data.product,
      price: data.price,
      urlImage: urlImage,
    });
    setIsLoading(false);
    setUrlImage("");
    setProgress(0);
    reset();
    onClose();
  };

  const handleGoogleSignInitiate = async () => {
    try {
      const user = await signInWithGoogle();
    } catch (e) {
      console.log(e);
    }
  };

  const handleUploadAnImage = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setImage(file);
    const urlImage = "";
    if (file.type.includes("image")) {
      const task = uploadImage(file);

      task.on(
        "state_changed",
        (snapshot) => {
          const percentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(percentage);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(task.snapshot.ref).then((url) => {
            setUrlImage(url);
          });
        }
      );
    } else {
      console.log("no es una imagen");
    }
    return urlImage;
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log("entro");
        setLogin(true);
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  const handleDeleteAnArticle = async (product) => {
    setIsDelete(true);
    await deleteDoc(doc(db, "article", product));
    setIsDelete(false);
  };

  const handleEditeAnArticle = async ({ product, price, urlImage }) => {
    onOpen();
    setValue("product", product);
    setValue("price", price);

    // setIsLoading(true);
    // await setDoc(doc(db, "article", "algo"), {
    //   product: data.product,
    //   price: data.price,
    //   urlImage: urlImage,
    // });
    // setIsLoading(false);
  };

  const handleLogOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setLogin(false);
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <>
      {login ? (
        <VStack>
          <Container>
            <Button
              colorScheme="blue"
              variant="solid"
              onClick={onOpen}
              marginTop={6}
              width="100%"
            >
              Agregar producto
            </Button>

            {isLoading ? (
              <p>cargando...</p>
            ) : (
              <>
                <Text as="h1" textAlign="center" marginTop={6}>
                  Lista de productos
                </Text>
                <List
                  styleType="none"
                  spacing={2}
                  marginTop={4}
                  marginRight="auto"
                  marginLeft="auto"
                  width="80%"
                >
                  {products.map((product) => {
                    return (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        key={nanoid()}
                      >
                        <Flex
                          alignItems="center"
                          justifyContent="space-between"
                          height="70px"
                          borderRadius="sm"
                        >
                          <Image
                            src={product.urlImage}
                            height="70px"
                            width="70px"
                            objectFit="contain"
                          />
                          <ListItem key={product.product} letterSpacing={1}>
                            {product.product}{" "}
                            {parseInt(product.price).toLocaleString("es-AR", {
                              style: "currency",
                              currency: "ARS",
                            })}
                          </ListItem>
                          <ButtonGroup>
                            <Button
                              size="xs"
                              onClick={() =>
                                handleDeleteAnArticle(product.product)
                              }
                              isDisabled={isDelete}
                            >
                              X
                            </Button>
                            <Button
                              size="xs"
                              onClick={() => handleEditeAnArticle(product)}
                              isDisabled={isDelete}
                            >
                              E
                            </Button>
                          </ButtonGroup>
                        </Flex>
                        <Divider orientation="horizontal" border="1px" />
                      </motion.div>
                    );
                  })}
                </List>
              </>
            )}

            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalCloseButton />
                <form onSubmit={handleSubmit(onSubmit)}>
                  <ModalBody>
                    <FormControl>
                      <input {...register("product")} placeholder="product" />
                    </FormControl>
                    <FormControl>
                      <input
                        {...register("price")}
                        placeholder="price"
                        type="phone"
                      />
                    </FormControl>
                    {urlImage ? (
                      <img src={urlImage} alt="image" />
                    ) : (
                      <>
                        <Textarea
                          name="description"
                          onDrop={handleUploadAnImage}
                          id="file"
                          cols="30"
                          rows="10"
                        ></Textarea>
                        <Progress value={progress} />
                      </>
                    )}
                  </ModalBody>

                  <ModalFooter>
                    <HStack width="100%" justifyContent="space-between">
                      <Button
                        variant="ghost"
                        onClick={onClose}
                        isLoading={isLoading}
                      >
                        Cerrar
                      </Button>
                      <Button
                        colorScheme="blue"
                        mr={3}
                        type="submit"
                        isLoading={isLoading}
                      >
                        Guardar
                      </Button>
                    </HStack>
                  </ModalFooter>
                </form>
              </ModalContent>
            </Modal>
          </Container>
          <Button onClick={handleLogOut}>Cerrar sesion</Button>
        </VStack>
      ) : (
        <Container minH="100vh">
          <Flex
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            minHeight="100vh"
          >
            <Box
              height="300px"
              width="100%"
              boder="1px solid grey"
              boxShadow="lg"
            >
              <Text textAlign="center" marginTop={10}>
                Login
              </Text>
              <Flex justifyContent="center" marginTop={10}>
                <Button onClick={handleGoogleSignInitiate}>
                  Iniciar con google
                </Button>
              </Flex>
            </Box>
          </Flex>
        </Container>
      )}
    </>
  );
}
