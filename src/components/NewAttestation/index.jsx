import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useNetwork
} from 'wagmi'
import { AttestationStationAddress } from '../../constants/addresses'
import AttestationStationABI from '../../constants/abi.json'

import { AttestForm, FormRow, FormLabel } from '../StyledFormComponents'
import { H2 } from '../OPStyledTypography'
import { TextInput } from '../OPStyledTextInput'
import { PrimaryButton } from '../OPStyledButton'

const FormButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 28px 0px 0px;
  width: 672px;
`

const HashedKey = styled.textarea`
  align-items: center;
  border: 1px solid #cbd5e0;
  border-radius: 12px;
  box-sizing: border-box;
  font-size: 14px;
  margin: 8px 0;
  outline-style: none;
  padding: 9px 12px;
  height: 48px;
  width: 456px;
  resize:none;
`

const Link = styled.a`
  color: #f01a37;
`

const FeedbackMessage = styled.span`
  padding: 0px 36px;
`

const NewAttestation = () => {
  const { chain } = useNetwork()
  const [etherscanBaseLink, setEtherscanBaseLink] = useState('')

  const [telegramID, setTelegramID] = useState('')

  const [about, setAbout] = useState('')
  const [key, setKey] = useState('')
  const [hashedKey, setHashedKey] = useState('')
  const [val, setVal] = useState('')
  const [attestation, setAttestation] = useState()

  const [isAboutValid, setIsAboutValid] = useState(false)
  const [isKeyValid, setIsKeyValid] = useState(false)
  const [isValValid, setIsValValid] = useState(false)

  const {
    config,
    error: prepareError,
    isError: isPrepareError
  } = usePrepareContractWrite({
    address: AttestationStationAddress,
    abi: AttestationStationABI,
    functionName: 'attest',
    args: [
      [attestation]
    ],
    enabled: Boolean(about) && Boolean(key) && Boolean(val)
  })
  const { data, error, isError, write } = useContractWrite(config)

  useEffect(() => {
    try {
      if (chain.name === 'Optimism') {
        setEtherscanBaseLink('https://optimistic.etherscan.io/tx/')
      }
      if (chain.name === 'Optimism Goerli') {
        setEtherscanBaseLink('https://goerli-optimism.etherscan.io/tx/')
      }
    } catch (e) {
      console.error(e)
    }
  }, [chain])

  useEffect(() => {
    try {
      let attest
      if (key.length > 31) {
        attest = {
          about,
          key: hashedKey,
          val: ethers.utils.toUtf8Bytes(val === '' ? '0x' : val)
        }
      } else {
        attest = {
          about,
          key: ethers.utils.formatBytes32String(key === '' ? '0x' : key),
          val: ethers.utils.toUtf8Bytes(val === '' ? '0x' : val)
        }
      }
      setAttestation(attest)
    } catch (e) {
      console.error(e)
    }
    setIsAboutValid(ethers.utils.isAddress(about))
    // todo: make this more robust
    setIsKeyValid(key !== '')
    setIsValValid(val !== '')
  }, [about, key, val])

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash
  })

  return (
    <>
      <H2>New Attestation</H2>
      <AttestForm
        onSubmit={(e) => {
          e.preventDefault()
          write?.()
        }}
      >
        <FormRow>
          <FormLabel>val</FormLabel>
          <TextInput
            type="text"
            placeholder="Alex Doe"
            onChange={(e) => setVal(e.target.value)}
            value={val}
            valid={isAboutValid}
            />
        </FormRow>
        <FormRow>
          <FormLabel>Name</FormLabel>
          <TextInput
            type="text"
            placeholder="Alex Doe"
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            valid={isAboutValid}
            />
        </FormRow>
           <>
            <FormRow>
              <FormLabel>
                Description
              </FormLabel>
              <TextInput
                type="text"
                placeholder="Didn't shower in the past two weeks."
                onChange={(e) => setAbout(e.target.value)}
                value={about}
                valid={isAboutValid}
              />
            </FormRow>

            <FormRow>
              <FormLabel>
                URL to Profile Picture
              </FormLabel>
              <TextInput
                type="text"
                onChange={(e) => {
                  const key = e.target.value
                  if (key.length > 31) {
                    setKey(key)
                    const bytesLikeKey = ethers.utils.toUtf8Bytes(key)
                    const keccak256HashedKey = ethers.utils.keccak256(bytesLikeKey)
                    setHashedKey(keccak256HashedKey)
                  } else {
                    setKey(key)
                    setHashedKey('')
                  }
                }}
                placeholder="https://9x.lol/cat.png"
                value={key}
                valid={isKeyValid}
              />
            </FormRow>
            {key.length > 31
              ? <FormRow>
                  <FormLabel>
                    ASS
                  </FormLabel>
                  <HashedKey
                    type="text"
                    readOnly
                    value={hashedKey}
                    />
                </FormRow>
              : <span></span>
            }
            <H2>Socials</H2>
            <FormRow>
              <FormLabel>
                Telegram
              </FormLabel>
              <TextInput
                type="text"
                placeholder="https://t.me/alex"
                onChange={(e) => setTelegramID(e.target.value)}
                value={telegramID}
                valid={isValValid}
              />
            </FormRow>
            <FormRow>
              <FormLabel>
                Instagram
              </FormLabel>
              <TextInput
                type="text"
                placeholder="https://instagram.com/alex"
                onChange={(e) => setTelegramID(e.target.value)}
                value={telegramID}
                valid={isValValid}
              />
            </FormRow>
            <FormRow>
              <FormLabel>
                Pinterest
              </FormLabel>
              <TextInput
                type="text"
                placeholder="Who even uses Pinterest wtf"
                onChange={(e) => setTelegramID(e.target.value)}
                value={telegramID}
                valid={isValValid}
              />
            </FormRow>
            <FormRow>
              <FormLabel>
                Facebook
              </FormLabel>
              <TextInput
                type="text"
                placeholder="??????????"
                onChange={(e) => setTelegramID(e.target.value)}
                value={telegramID}
                valid={isValValid}
              />
            </FormRow>

            <FormRow>
              <FormLabel>
                Twitter
              </FormLabel>
              <TextInput
                type="text"
                placeholder="https://twitter.com/alex"
                onChange={(e) => setTelegramID(e.target.value)}
                value={telegramID}
                valid={isValValid}
              />
            </FormRow>
            <FormRow>
              <FormLabel>
                Youtube
              </FormLabel>
              <TextInput
                type="text"
                placeholder="https://www.youtube.com/@Alex"
                onChange={(e) => setTelegramID(e.target.value)}
                value={telegramID}
                valid={isValValid}
              />
            </FormRow>
            <FormRow>
              <FormLabel>
                Reddit
              </FormLabel>
              <TextInput
                type="text"
                placeholder="https://www.reddit.com/user/alex/"
                onChange={(e) => setTelegramID(e.target.value)}
                value={telegramID}
                valid={isValValid}
              />
            </FormRow>
            <FormRow>
              <FormLabel>
                Discord
              </FormLabel>
              <TextInput
                type="text"
                placeholder="https://discord.com/users/955094938998173718"
                onChange={(e) => setTelegramID(e.target.value)}
                value={telegramID}
                valid={isValValid}
              />
            </FormRow>
            <FormRow>
              <FormLabel>
                LinkedIn
              </FormLabel>
              <TextInput
                type="text"
                placeholder="https://linkedin.com/in/AlexGigaChad"
                onChange={(e) => setTelegramID(e.target.value)}
                value={telegramID}
                valid={isValValid}
              />
            </FormRow>
            <FormRow>
              <FormLabel>
                Email
              </FormLabel>
              <TextInput
                type="text"
                placeholder="a@9x.lol"
                onChange={(e) => setTelegramID(e.target.value)}
                value={telegramID}
                valid={isValValid}
              />
            </FormRow>
            <FormButton>
              <PrimaryButton disabled={!write || isLoading || !(isAboutValid && isKeyValid && isValValid)}>
                {isLoading ? 'Making attestion' : 'Make attestation'}
              </PrimaryButton>
            </FormButton>
            {isSuccess && (
              <FeedbackMessage>
                Successfully made attestation:&nbsp;
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${etherscanBaseLink}${data?.hash}`}>
                    etherscan transaction
                </Link>
              </FeedbackMessage>
            )}
          </>
          <></>
        {(isPrepareError || isError) && (
          <FeedbackMessage>
              Error: {(prepareError || error)?.message}
          </FeedbackMessage>
        )}
      </AttestForm>
    </>
  )
}

export default NewAttestation
