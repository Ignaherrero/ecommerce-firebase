import { doc, setDoc } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { db, uploadImage } from "../../firebase/firebase-config";
import { getDownloadURL } from "firebase/storage";
import {
  Container,
  FormControl,
  Progress,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import {
  ContextLogin,
  LoginContextProvider,
} from "../../context/login-context";

export default function Admin() {
  const [progress, setProgress] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [urlImage, setUrlImage] = useState("");
  const [image, setImage] = useState("");
  const { login, setLogin } = useContext(ContextLogin);

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

  const onSubmit = async (data) => {
    await setDoc(doc(db, "article", data.product), {
      product: data.product,
      price: data.price,
      urlImage: urlImage,
    });
    reset();
  };

  return (
    <>
      <Container width="sm">
        <Text as="h1">Nuevo producto</Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <input {...register("product")} placeholder="product" />
          </FormControl>
          <FormControl>
            <input {...register("price")} placeholder="price" />
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
          <button type="submit">Submit</button>
        </form>
        <Link href="http://localhost:3000/">
          <a>Volver</a>
        </Link>
      </Container>
    </>
  );
}
