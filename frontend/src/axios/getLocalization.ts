interface ViaCep {
  erro?: boolean;
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

// const getLocalization = useCallback(
//   async (event: any) => {
//     if (!event) return;
//     if (event.length < 9) return;
//     const normalizedCep = event.replace(/\D/g, '');

//     setIsLoadingCep(true);

//     try {
//       const response = await axios.get<ViaCep>(
//         `https://viacep.com.br/ws/${normalizedCep}/json/`
//       );

//       if (response.data.erro) {
//         throw new Error('CEP Invalido');
//       }

//       if (response.data && !response.data.erro) {
//         // setValue(logradouroFieldName, response.data.logradouro, {
//         //   shouldValidate: true,
//         //   shouldDirty: true,
//         // });
//         // setValue(bairroFieldName, response.data.bairro, {
//         //   shouldValidate: true,
//         //   shouldDirty: true,
//         // });
//         setValue(cidadeFieldName, response.data.localidade, {
//           shouldValidate: true,
//           shouldDirty: true,
//         });
//         setValue(ufFieldName, response.data.uf, {
//           shouldValidate: true,
//           shouldDirty: true,
//         });
//         // if (response.data.complemento) {
//         //   setValue(complementoFieldName, response.data.complemento, {
//         //     shouldValidate: true,
//         //     shouldDirty: true,
//         //   });
//         // } else {
//         //   setValue(complementoFieldName, '', {
//         //     shouldValidate: true,
//         //     shouldDirty: true,
//         //   });
//         // }
//         methods.clearErrors(cepFieldName);
//         lastProcessedCep.current = normalizedCep;
//       } else {
//         // setValue(logradouroFieldName, '', {
//         //   shouldValidate: true,
//         //   shouldDirty: true,
//         // });
//         // setValue(bairroFieldName, '', {
//         //   shouldValidate: true,
//         //   shouldDirty: true,
//         // });
//         setValue(cidadeFieldName, '', {
//           shouldValidate: true,
//           shouldDirty: true,
//         });
//         setValue(ufFieldName, '', {
//           shouldValidate: true,
//           shouldDirty: true,
//         });
//         // setValue(complementoFieldName, '', {
//         //   shouldValidate: true,
//         //   shouldDirty: true,
//         // });

//         methods.setError(
//           cepFieldName,
//           {
//             type: 'manual',
//             message: 'CEP não encontrado ou inválido.',
//           },
//           { shouldFocus: true }
//         );
//         // lastProcessedCep.current = null;
//       }
//     } catch (error) {
//       setValue(logradouroFieldName, '', {
//         shouldValidate: true,
//         shouldDirty: true,
//       });
//       setValue(bairroFieldName, '', {
//         shouldValidate: true,
//         shouldDirty: true,
//       });
//       setValue(cidadeFieldName, '', {
//         shouldValidate: true,
//         shouldDirty: true,
//       });
//       setValue(ufFieldName, '', {
//         shouldValidate: true,
//         shouldDirty: true,
//       });
//       setValue(complementoFieldName, '', {
//         shouldValidate: true,
//         shouldDirty: true,
//       });
//       methods.setError(
//         cepFieldName,
//         {
//           type: 'manual',
//           message: 'Erro na consulta do CEP. Tente novamente.',
//         },
//         { shouldFocus: true }
//       );
//       // lastProcessedCep.current = null;
//     } finally {
//       setIsLoadingCep(false);
//     }
//   },
//   [
//     setValue,
//     methods,
//     logradouroFieldName,
//     bairroFieldName,
//     cidadeFieldName,
//     ufFieldName,
//     complementoFieldName,
//     cepFieldName,
//   ]
// );
