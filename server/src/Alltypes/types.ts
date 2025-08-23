// export const changePasswordSchema = z
//   .object({
//     oldPassword: z
//       .string()
//       .min(6, "Old password must be at least 8 characters long."),
//     newPassword: z
//       .string()
//       .min(6, "New password must be at least 8 characters long."),
//   })
//   .superRefine(({ oldPassword, newPassword }, refinementContext) => {
//     if (oldPassword === newPassword) {
//       refinementContext.addIssue({
//         code: "custom",
//         message: "New password cannot be the same as the old password.",
//         path: ["newPassword"],
//       });
//     }
//   });