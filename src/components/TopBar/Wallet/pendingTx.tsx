// const pendingTransactions = useSelector(state => {
//   return state.pendingTransactions;
// }); // [{ txnHash: "3241141", text: "test" }];

// const PendingTxsList = ({ pendingTxs, anchorEl }) => {
//   <Popper id={id} open={open} anchorEl={walletButtonRef.current} placement="bottom-end">
//             <Fade {...TransitionProps} timeout={100}>
//               <Paper className="ohm-menu" elevation={1}>
//                 {pendingTransactions.map(({ txnHash, text }) => (
//                   <Box key={txnHash} fullWidth>
//                     <Link key={txnHash} href={getEtherscanUrl({ chainID, txnHash })} target="_blank" rel="noreferrer">
//                       <Button size="large" variant="contained" color="secondary" fullWidth>
//                         <Typography align="left">
//                           {text} <SvgIcon component={ArrowUpIcon} />
//                         </Typography>
//                       </Button>
//                     </Link>
//                   </Box>
//                 ))}
//               </Paper>
//             </Fade>
//       </Popper>
// }

export default {};
