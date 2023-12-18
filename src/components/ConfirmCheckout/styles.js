/** @format */

import { StyleSheet, I18nManager } from "react-native";
import { Constants, Color } from "@common";

export default StyleSheet.create({
  container:{
    backgroundColor:"white",
    borderRadius:30,
    padding:10,
    margin: 15
  },
  row:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    paddingVertical: 10
  },
  label:{
    color: "#919191",
    fontSize: 14,
    fontFamily:Constants.fontFamily
  },
  value:{
    fontSize: 14
  },
  divider:{
    height: 0.5,
    backgroundColor: "#919191"
  }
});
